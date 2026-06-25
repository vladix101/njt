package com.projekat.backend.service;

import com.projekat.backend.dto.CandidateWithGroupsDto;
import com.projekat.backend.dto.CandidateSummaryDto;
import com.projekat.backend.dto.ListeningGroupDetailsDto;
import com.projekat.backend.dto.ListeningGroupDto;
import com.projekat.backend.dto.ListeningGroupRequestDto;
import com.projekat.backend.entity.Candidate;
import com.projekat.backend.entity.Course;
import com.projekat.backend.entity.Instructor;
import com.projekat.backend.entity.LC;
import com.projekat.backend.entity.ListeningGroup;
import com.projekat.backend.exception.ValidationException;
import com.projekat.backend.repository.CandidateRepository;
import com.projekat.backend.repository.CourseRepository;
import com.projekat.backend.repository.InstructorRepository;
import com.projekat.backend.repository.LCRepository;
import com.projekat.backend.repository.ListeningGroupRepository;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ListeningGroupService {

    private final ListeningGroupRepository listeningGroupRepository;
    private final CandidateRepository candidateRepository;
    private final CourseRepository courseRepository;
    private final InstructorRepository instructorRepository;
    private final LCRepository lcRepository;
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String mailSenderAddress;

    private static final DateTimeFormatter PDF_DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy. HH:mm");

    @Transactional(readOnly = true)
    public List<ListeningGroupDto> getListeningGroups() {
        return listeningGroupRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ListeningGroupDto getListeningGroup(Long id) {
        return toDto(listeningGroupRepository.getReferenceById(id));
    }

    @Transactional(readOnly = true)
    public ListeningGroupDetailsDto getListeningGroupDetails(Long id) {
        ListeningGroup listeningGroup = listeningGroupRepository.getReferenceById(id);
        List<CandidateSummaryDto> candidates = listeningGroup.getLcs()
                .stream()
                .map(LC::getCandidate)
                .map(this::toCandidateSummaryDto)
                .toList();

        return new ListeningGroupDetailsDto(toDto(listeningGroup), candidates, candidateRepository.count());
    }

    @Transactional
    public ListeningGroupDto createListeningGroup(ListeningGroupRequestDto requestDto) {
        validateListeningGroup(requestDto, null);

        ListeningGroup listeningGroup = new ListeningGroup();
        applyRequest(listeningGroup, requestDto);
        return toDto(listeningGroupRepository.save(listeningGroup));
    }

    @Transactional
    public ListeningGroupDto updateListeningGroup(Long id, ListeningGroupRequestDto requestDto) {
        validateListeningGroup(requestDto, id);

        ListeningGroup listeningGroup = listeningGroupRepository.getReferenceById(id);
        applyRequest(listeningGroup, requestDto);
        return toDto(listeningGroupRepository.save(listeningGroup));
    }

    @Transactional
    public void deleteListeningGroup(Long id) {
        listeningGroupRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ListeningGroupDto> getListeningGroupsForCandidate(Long candidateId) {
        return listeningGroupRepository.findByLcsCandidateId(candidateId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ListeningGroupDto joinListeningGroup(Long candidateId, Long listeningGroupId) {
        Candidate candidate = candidateRepository.getReferenceById(candidateId);
        ListeningGroup listeningGroup = listeningGroupRepository.getReferenceById(listeningGroupId);

        boolean alreadyJoined = lcRepository.findByCandidateIdAndListeningGroupId(candidateId, listeningGroupId).isPresent();
        if (!alreadyJoined) {
            LC lc = lcRepository.save(new LC(null, listeningGroup, candidate));
            sendListeningGroupConfirmationEmail(lc);
        }

        return toDto(listeningGroup);
    }

    @Transactional(readOnly = true)
    public byte[] generateConfirmationPdf(Long candidateId, Long listeningGroupId) {
        LC lc = lcRepository.findByCandidateIdAndListeningGroupId(candidateId, listeningGroupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Confirmation is available only for joined listening groups"));

        return buildConfirmationPdf(lc);
    }

    @Transactional(readOnly = true)
    public List<CandidateWithGroupsDto> getCandidatesWithListeningGroups() {
        return candidateRepository.findAll()
                .stream()
                .map(this::toCandidateWithGroupsDto)
                .toList();
    }

    private void validateListeningGroup(ListeningGroupRequestDto requestDto, Long existingId) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();

        if (requestDto.getStartDate() != null && requestDto.getEndDate() != null
                && requestDto.getEndDate().isBefore(requestDto.getStartDate())) {
            fieldErrors.put("endDate", "End date must not be before start date");
        }

        if (requestDto.getCourseId() != null && requestDto.getStartDate() != null) {
            LocalDate startDate = requestDto.getStartDate().toLocalDate();
            LocalDateTime dayStart = startDate.atStartOfDay();
            LocalDateTime nextDayStart = startDate.plusDays(1).atStartOfDay();

            boolean duplicateExists = existingId == null
                    ? listeningGroupRepository.existsByCourseIdAndStartDateGreaterThanEqualAndStartDateLessThan(requestDto.getCourseId(), dayStart, nextDayStart)
                    : listeningGroupRepository.existsByCourseIdAndStartDateGreaterThanEqualAndStartDateLessThanAndIdNot(requestDto.getCourseId(), dayStart, nextDayStart, existingId);

            if (duplicateExists) {
                fieldErrors.put("startDate", "A listening group already exists for this course on this date");
            }
        }

        if (!fieldErrors.isEmpty()) {
            throw new ValidationException(fieldErrors);
        }
    }

    private void applyRequest(ListeningGroup listeningGroup, ListeningGroupRequestDto requestDto) {
        listeningGroup.setName(requestDto.getName());
        listeningGroup.setStartDate(requestDto.getStartDate());
        listeningGroup.setEndDate(requestDto.getEndDate());

        Course course = requestDto.getCourseId() == null ? null : courseRepository.getReferenceById(requestDto.getCourseId());
        Instructor instructor = requestDto.getInstructorId() == null ? null : instructorRepository.getReferenceById(requestDto.getInstructorId());

        listeningGroup.setCourse(course);
        listeningGroup.setInstructor(instructor);
    }

    private CandidateWithGroupsDto toCandidateWithGroupsDto(Candidate candidate) {
        List<ListeningGroupDto> groups = candidate.getLcs()
                .stream()
                .map(LC::getListeningGroup)
                .map(this::toDto)
                .toList();

        String username = candidate.getUserProfile() == null ? null : candidate.getUserProfile().getUsername();
        String cityName = candidate.getCity() == null ? null : candidate.getCity().getName();

        return new CandidateWithGroupsDto(candidate.getId(), candidate.getName(), candidate.getSurname(),
                username, candidate.getAge(), cityName, groups);
    }

    private CandidateSummaryDto toCandidateSummaryDto(Candidate candidate) {
        String username = candidate.getUserProfile() == null ? null : candidate.getUserProfile().getUsername();
        return new CandidateSummaryDto(candidate.getId(), candidate.getName(), candidate.getSurname(), username);
    }

    private ListeningGroupDto toDto(ListeningGroup listeningGroup) {
        Course course = listeningGroup.getCourse();
        Instructor instructor = listeningGroup.getInstructor();
        String instructorName = instructor == null ? null : instructor.getName() + " " + instructor.getSurname();
        String subjectName = course == null || course.getSubject() == null ? null : course.getSubject().getName();

        return new ListeningGroupDto(
                listeningGroup.getId(),
                listeningGroup.getName(),
                listeningGroup.getStartDate(),
                listeningGroup.getEndDate(),
                course == null ? null : course.getId(),
                course == null ? null : course.getName(),
                course == null ? null : course.getLevel(),
                course == null ? null : course.getDescription(),
                subjectName,
                instructor == null ? null : instructor.getId(),
                instructorName
        );
    }

    private void sendListeningGroupConfirmationEmail(LC lc) {
        Candidate candidate = lc.getCandidate();
        ListeningGroup listeningGroup = lc.getListeningGroup();
        String email = candidate.getUserProfile() == null ? null : candidate.getUserProfile().getEmail();
        if (email == null || email.isBlank()) {
            return;
        }

        byte[] pdf = buildConfirmationPdf(lc);
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mailSenderAddress);
            helper.setTo(email);
            helper.setSubject("Listening Group Registration Confirmation");
            helper.setText("""
                    Your listening group registration was completed successfully.

                    The confirmation PDF is attached to this email.
                    """);
            helper.addAttachment(buildConfirmationFileName(listeningGroup), () -> new java.io.ByteArrayInputStream(pdf), "application/pdf");
            javaMailSender.send(message);
        } catch (MessagingException | MailException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Confirmation email could not be sent");
        }
    }

    private byte[] buildConfirmationPdf(LC lc) {
        try {
            Candidate candidate = lc.getCandidate();
            ListeningGroup listeningGroup = lc.getListeningGroup();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 48, 48, 54, 48);
            PdfWriter.getInstance(document, outputStream);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Course course = listeningGroup.getCourse();
            String courseName = course == null ? "No course" : course.getName();
            String groupName = listeningGroup.getName() == null ? "Selected group" : listeningGroup.getName();

            Paragraph title = new Paragraph("Listening Group Registration Confirmation", titleFont);
            title.setSpacingAfter(18);
            document.add(title);

            Paragraph intro = new Paragraph(
                    "You have successfully registered for the listening group " + groupName
                            + " for the course " + courseName + ".",
                    textFont
            );
            intro.setSpacingAfter(16);
            document.add(intro);

            document.add(new Paragraph("Registration Details", sectionFont));
            document.add(detailLine("Candidate", candidate.getName() + " " + candidate.getSurname(), textFont));
            document.add(detailLine("Course", courseName, textFont));
            document.add(detailLine("Course level", course == null ? "No level" : course.getLevel(), textFont));
            document.add(detailLine("Subject", course == null || course.getSubject() == null ? "No subject" : course.getSubject().getName(), textFont));
            document.add(detailLine("Listening group", groupName, textFont));
            document.add(detailLine("Start date", formatPdfDate(listeningGroup.getStartDate()), textFont));
            document.add(detailLine("End date", formatPdfDate(listeningGroup.getEndDate()), textFont));
            document.add(detailLine("Confirmation date/time", formatPdfDate(resolveJoinedAt(lc)), textFont));

            Paragraph footer = new Paragraph("Welcome to our learning platform. We wish you a successful learning experience.", textFont);
            footer.setSpacingBefore(20);
            document.add(footer);

            document.close();
            return outputStream.toByteArray();
        } catch (DocumentException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Confirmation PDF could not be generated");
        }
    }

    private Paragraph detailLine(String label, String value, Font textFont) {
        Paragraph paragraph = new Paragraph();
        paragraph.setSpacingBefore(7);
        paragraph.add(new Phrase(label + ": ", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
        paragraph.add(new Phrase(value == null || value.isBlank() ? "-" : value, textFont));
        return paragraph;
    }

    private String formatPdfDate(LocalDateTime dateTime) {
        return dateTime == null ? "Not available" : dateTime.format(PDF_DATE_FORMATTER);
    }

    private LocalDateTime resolveJoinedAt(LC lc) {
        return lc.getJoinedAt() == null ? LocalDateTime.now() : lc.getJoinedAt();
    }

    @Transactional(readOnly = true)
    public String buildConfirmationFileName(Long listeningGroupId) {
        ListeningGroup listeningGroup = listeningGroupRepository.getReferenceById(listeningGroupId);
        return buildConfirmationFileName(listeningGroup);
    }

    private String buildConfirmationFileName(ListeningGroup listeningGroup) {
        String groupName = listeningGroup.getName() == null ? "listening-group" : listeningGroup.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        return "confirmation-" + groupName.replaceAll("(^-|-$)", "") + ".pdf";
    }
}

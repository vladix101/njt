import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";

const EmailVerificationModal = ({email, isLoading, error, successMessage, onConfirm, onResend, onCancel}) => {
    const [code, setCode] = useState("")
    const [secondsLeft, setSecondsLeft] = useState(600)
    const isExpired = secondsLeft <= 0

    useEffect(() => {
        setCode("")
        setSecondsLeft(600)
    }, [email])

    useEffect(() => {
        if (secondsLeft <= 0) {
            return
        }

        const timerId = window.setInterval(() => {
            setSecondsLeft((currentSeconds) => Math.max(currentSeconds - 1, 0))
        }, 1000)

        return () => window.clearInterval(timerId)
    }, [secondsLeft])

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
    const seconds = String(secondsLeft % 60).padStart(2, "0")

    const handleCodeChange = (event) => {
        setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!isExpired && code.length === 6) {
            onConfirm(code)
        }
    }

    const handleResend = async () => {
        const resent = await onResend()
        if (resent) {
            setCode("")
            setSecondsLeft(600)
        }
    }

    return (
        <div className="verification-modal-backdrop" role="presentation">
            <section className="verification-modal" role="dialog" aria-modal="true" aria-labelledby="verification-title">
                <h2 id="verification-title">Email verification</h2>
                <p className="verification-copy">
                    Verification code was sent to <strong>{email}</strong>. Enter the 6-digit code to complete registration.
                </p>

                <div className={`verification-timer ${isExpired ? "timer-expired" : ""}`}>
                    {isExpired ? "Code expired" : `${minutes}:${seconds}`}
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="EmailVerificationCode">
                        <Form.Label>Verification code</Form.Label>
                        <Form.Control
                            type="text"
                            inputMode="numeric"
                            value={code}
                            onChange={handleCodeChange}
                            placeholder="123456"
                            disabled={isLoading}
                        />
                    </Form.Group>

                    {error && <p className="form-error">{error}</p>}
                    {successMessage && <p className="verification-success">{successMessage}</p>}

                    <div className="verification-actions">
                        <Button variant="secondary" type="button" onClick={onCancel} disabled={isLoading}>
                            Back
                        </Button>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={handleResend}
                            disabled={isLoading}
                        >
                            Resend code
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading || isExpired || code.length !== 6}
                        >
                            Confirm
                        </Button>
                    </div>
                </Form>
            </section>
        </div>
    )
}

export default EmailVerificationModal

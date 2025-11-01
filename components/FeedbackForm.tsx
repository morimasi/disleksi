import React, { useState } from 'react';
import { styles } from '../styles';

export const FeedbackForm = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message) {
            alert('Lütfen mesajınızı girin.');
            return;
        }
        console.log('Feedback Submitted:', { name, email, message });
        setSubmitted(true);
        setTimeout(onClose, 2000); // Close after 2 seconds
    };

    if (submitted) {
        return (
            <div style={styles.fullPageWrapper}>
                <div style={{textAlign: 'center', padding: '4rem 0'}}>
                    <h2 style={styles.pageTitle}>Teşekkürler!</h2>
                    <p>Geri bildiriminiz bizim için değerli.</p>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.fullPageWrapper}>
            <h2 style={styles.pageTitle}>Geri Bildirim Formu</h2>
            <form onSubmit={handleSubmit} style={styles.feedbackForm}>
                <div style={styles.formGroup}>
                    <label htmlFor="name">Adınız (İsteğe bağlı)</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} style={styles.formInput} />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="email">E-posta (İsteğe bağlı)</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} style={styles.formInput} />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="message">Mesajınız *</label>
                    <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} style={styles.formTextarea} rows={6} required></textarea>
                </div>
                <div style={{textAlign: 'right'}}>
                    <button type="button" onClick={onClose} style={styles.formButtonSecondary}>Vazgeç</button>
                    <button type="submit" style={styles.formButton}>Gönder</button>
                </div>
            </form>
        </div>
    );
}
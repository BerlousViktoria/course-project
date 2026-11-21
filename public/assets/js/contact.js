document.addEventListener('DOMContentLoaded', () => {
    const contactForms = document.querySelectorAll('.contact-form, #contact-modal-form');

    contactForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const payload = {
                name: formData.get('name')?.trim(),
                email: formData.get('email')?.trim(),
                subject: formData.get('subject')?.trim() || null,
                phone: formData.get('phone')?.trim() || null,
                message: formData.get('message')?.trim()
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Помилка надсилання заявки');

                form.reset();
                alert('Дякуємо! Вашу заявку успішно надіслано.');
            } catch (error) {
                console.error(error);
                alert('Не вдалося надіслати заявку. Спробуйте пізніше.');
            }
        });
    });
});
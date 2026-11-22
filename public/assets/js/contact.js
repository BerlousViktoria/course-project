document.addEventListener('DOMContentLoaded', () => {
    const contactForms = document.querySelectorAll('.contact-form, #modal-form');

    contactForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                name: (form.querySelector('[name="name"], #modal-name')?.value || '').trim(),
                email: (form.querySelector('[name="email"], #modal-email')?.value || '').trim(),
                subject: (form.querySelector('[name="subject"]')?.value || '').trim() || null,
                phone: (form.querySelector('[name="phone"], #modal-phone')?.value || '').trim() || null,
                message: (form.querySelector('[name="message"], #modal-message')?.value || '').trim()
            };

            if (!payload.name || !payload.email || !payload.message) {
                alert('Будь ласка, заповніть обов’язкові поля (Ім’я, Email, Повідомлення).');
                return;
            }

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Помилка надсилання заявки');

                form.reset();
                alert('Дякуємо! Вашу заявку успішно надіслано.');

                const modalWrap = document.getElementById('modal');
                if (form.id === 'modal-form' && modalWrap) {
                    modalWrap.classList.add('d-none');
                }
            } catch (error) {
                console.error(error);
                alert('Не вдалося надіслати заявку. Спробуйте пізніше.');
            }
        });
    });
});
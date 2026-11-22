document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.contact-form, #modal-form').forEach(form => {
        const isModal = form.id === 'modal-form';
        const status = form.querySelector(isModal ? '#modal-status' : '.form-status');
        const inputs = [...form.querySelectorAll('input[name], textarea[name]')];

        const getError = el => el.parentElement.querySelector('.incorrect-form') || el.nextElementSibling;

        inputs.forEach(el => {
            el.addEventListener('input', () => {
                getError(el)?.classList.add('d-none');
                status?.classList.add('d-none');
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const valid = inputs.map(el => {
                el.value = el.value.trim();
                const ok = el.checkValidity();
                getError(el)?.classList.toggle('d-none', ok);
                return ok;
            }).every(Boolean);

            if (!valid) return;

            const data = Object.fromEntries(new FormData(form));

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error();

                form.reset();
                if (status) {
                    status.textContent = 'Дякуємо! Вашу заявку успішно надіслано.';
                    status.className = `${isModal ? 'modal-status' : 'form-status'} success`;
                }
                if (isModal) {
                    setTimeout(() => document.getElementById('modal')?.classList.add('d-none'), 1500);
                }
            } catch {
                if (status) {
                    status.textContent = 'Не вдалося надіслати заявку. Спробуйте пізніше.';
                    status.className = `${isModal ? 'modal-status' : 'form-status'} error`;
                }
            }
        });
    });
});
import { z } from 'zod';

const form = document.querySelector('form');

form?.addEventListener('submit', (e) => {
  const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
    password: z.string().min(6, 'Password too short'),
  });

  const data = {
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
  };

  const result = schema.safeParse(data);
  if (!result.success) {
    e.preventDefault();
    alert(result.error.issues.map(i => i.message).join('\n'));
  }
});

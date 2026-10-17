import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="min-h-[70vh] grid place-items-center container-x text-center">
      <div>
        <div className="text-7xl font-serif font-bold text-brand-700 mb-4">404</div>
        <p className="text-ink/70 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </section>
  );
}

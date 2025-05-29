import { Link } from 'react-router';

function ErrorPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="display-1 text-danger">404</h1>
          <h2 className="mb-4">Pagina non trovata</h2>
          <p className="lead mb-4">La pagina che stai cercando non esiste.</p>
          <Link to="/" className="btn btn-primary">
            Torna alla Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
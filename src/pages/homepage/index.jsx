function HomePage() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="display-4 text-primary mb-4">Benvenuto nella Homepage</h1>
          <p className="lead">Questa è la pagina principale della tua applicazione React.</p>
          <div className="mt-4">
            <button className="btn btn-primary btn-lg me-3">Inizia ora</button>
            <button className="btn btn-outline-secondary btn-lg">Scopri di più</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
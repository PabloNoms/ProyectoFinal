import { useState, useEffect } from 'react';
import {
  obtenerPublicaciones,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
} 
from '../../services/publicaciones';
import styles from './Publicaciones.module.css';

export default function Publicaciones() {
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarLista();
  }, []);

  async function cargarLista() {
    setCargando(true);
    const data = await obtenerPublicaciones();
    setLista(data);
    setCargando(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!titulo || !contenido) {
      alert('Completá todos los campos');
      return;
    }

    if (editando) {
      await actualizarPublicacion(editando.id, titulo, contenido);
    } else {
      await crearPublicacion(titulo, contenido);
    }

    setTitulo('');
    setContenido('');
    setEditando(null);
    cargarLista();
  }

  function handleEditar(pub) {
    setEditando(pub);
    setTitulo(pub.titulo);
    setContenido(pub.contenido);
  }

  async function handleBorrar(id) {
    if (!confirm('¿Seguro que querés borrar esto?')) return;
    await eliminarPublicacion(id);
    setLista(lista.filter((p) => p.id !== id));
  }

  return (
    <section className={styles.pagina}>

      <div className={styles.encabezado}>
        <h1>Publicaciones</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.campo}>
          <label>Título</label>
          <input
            type="text"
            placeholder="Título de la publicación"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label>Contenido</label>
          <textarea
            rows={4}
            placeholder="Escribí el contenido acá"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
        </div>

        <div className={styles.botonesForm}>
          <button type="submit">
            {editando ? 'Guardar cambios' : 'Publicar'}
          </button>
          {editando && (
            <button
              type="button"
              className={styles.btnCancelar}
              onClick={() => {
                setEditando(null);
                setTitulo('');
                setContenido('');
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {cargando ? (
        <p className={styles.mensaje}>Cargando...</p>
      ) : lista.length === 0 ? (
        <p className={styles.mensaje}>Todavía no hay publicaciones</p>
      ) : (
        <ul className={styles.lista}>
          {lista.map((pub) => (
            <li key={pub.id} className={styles.item}>
              <h3>{pub.titulo}</h3>
              <p>{pub.contenido}</p>
              <span className={styles.fecha}>
                {new Date(pub.creado_en).toLocaleString('es-AR')}
              </span>
              <div className={styles.botones}>
              <button
                type="button"
                 className={styles.botonEditar}
                 onClick={() => handleEditar(pub)}
              >
                Editar
              </button>
                <button
                  type="button"
                  className={styles.botonPeligro}
                  onClick={() => handleBorrar(pub.id)}
               >
                  Borrar
                  </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
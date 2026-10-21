import '../../ui.css';

const ATTENDANCE = { VIRTUAL: 'Virtual', PRESENCIAL: 'Presencial' };

/** Cabecera informativa del detalle: badges, título, puntaje, descripción y tabla de datos. */
const ProductInfo = ({ product, seller = null, averageRating = null, reviewCount = 0 }) => {
  const { name, description, type, stock, category, minutesDuration, attendanceType } = product;
  const isService = type === 'SERVICE';
  const outOfStock = !isService && stock === 0;
  const lowStock = !isService && stock > 0 && stock < 10; // pocas unidades

  const rows = [
    ['Tipo', isService ? 'Servicio' : 'Producto físico'],
    ['Categoría', category.name],
    ...(isService
      ? [
          ...(minutesDuration ? [['Duración', `${minutesDuration} minutos`]] : []),
          ...(attendanceType ? [['Modalidad', ATTENDANCE[attendanceType] ?? attendanceType]] : []),
        ]
      : [['Stock disponible', outOfStock ? 'Sin stock' : `${stock} unidades`]]),
    ...(seller ? [['Publicado por', `${seller.firstName} ${seller.lastName}`]] : []),
  ];

  return (
    <div className="pd-info">
      <div className="pd-badges">
        <span className={`ui-badge ui-badge--${isService ? 'service' : 'physical'}`}>{isService ? 'SERVICIO' : 'FÍSICO'}</span>
        <span className="ui-badge">{category.name}</span>
        {!isService && (
          <span className={`ui-badge ${outOfStock ? 'ui-badge--stock-out' : lowStock ? 'ui-badge--stock-low' : 'ui-badge--stock-ok'}`}>
            {outOfStock ? 'Sin stock' : lowStock ? `⚠ Últimas ${stock} unidades` : '✓ En stock'}
          </span>
        )}
      </div>

      <h1 className="pd-title">{name}</h1>

      {averageRating !== null ? (
        <div className="pd-rating" aria-label={`Puntaje ${averageRating.toFixed(1)} de 5`}>
          <span className="pd-stars" aria-hidden="true">{'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}</span>
          <strong>{averageRating.toFixed(1)}</strong>
          <span className="pd-muted">{reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}</span>
        </div>
      ) : (
        <div className="pd-rating pd-muted">Todavía no tiene reseñas</div>
      )}

      <hr className="pd-divider" />
      <p className="pd-description">{description ?? 'Este producto no tiene descripción.'}</p>
      <hr className="pd-divider" />

      <table className="pd-table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductInfo;

import { useParams } from 'react-router-dom';

export default function DetalleActividadPage() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Detalle de Actividad</h1>
      <p>
        Viendo información de la actividad ID:{' '}
        <span className="font-mono bg-yellow-200 px-2">{id}</span>
      </p>
    </div>
  );
}

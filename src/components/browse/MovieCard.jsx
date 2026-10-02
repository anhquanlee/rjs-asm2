export default function MovieCard({ isLargeRow, ...props }) {
  return (
    <img
      className={`w-auto cursor-pointer object-contain transition-transform duration-450 ${
        isLargeRow
          ? 'max-h-67.5 hover:scale-[1.11]'
          : 'max-h-37.5 hover:scale-110'
      }`}
      {...props}
    />
  );
}

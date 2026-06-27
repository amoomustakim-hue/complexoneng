export default function ComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <p className="text-xs tracking-widest text-teal">COMING SOON</p>
      <h1 className="text-2xl font-bold text-teal mt-2">{title}</h1>
      <p className="text-sm text-muted mt-2 max-w-md mx-auto">{body}</p>
    </div>
  );
}

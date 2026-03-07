export default function Header({ chidren }: { chidren?: React.ReactNode }) {
  return <header className="flex font-semibold text-lg">{chidren}</header>;
}

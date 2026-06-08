
import Welcome from "./Welcome";
import Chat from "./Chat";
export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Welcome/>
      <div className="flex flex-col shadow-lg items-center gap-2 p-4 rounded-lg bg-gray-50">
        <Chat/>
      </div>
    </div>
  );
}
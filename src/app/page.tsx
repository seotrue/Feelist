import { Header } from "@/components/Header";
import { MoodInput } from "@/components/MoodInput";
import { MoodTags } from "@/components/MoodTags";
import { TrackList } from "@/components/TrackList";
import { PlaylistCard } from "@/components/PlaylistCard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-12">
        <MoodInput />
        <MoodTags />
        <PlaylistCard />
        <TrackList />
      </main>
    </div>
  );
}

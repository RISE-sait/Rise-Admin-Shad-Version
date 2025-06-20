"use client";

import { useEffect, useState } from "react";
import GamesPage from "@/components/games/GamesPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllGames } from "@/services/games";
import { StaffRoleEnum } from "@/types/user";
import { Game } from "@/types/games";
import { Skeleton } from "@/components/ui/skeleton";

export default function GamesPageContainer() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllGames();
        setGames(res);
      } catch (err) {
        console.error("Failed to fetch games", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const content = loading ? <PageSkeleton /> : <GamesPage games={games} />;

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className="flex">{content}</div>
    </RoleProtected>
  );
}

function PageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

import { createContext, useContext, useMemo, useState } from "react";

export type EventDetails = {
  churchName: string;
  date: string;
  time: string;
  eventName: string;
  venue: string;
  theme: string;
  otherInfo: string;
};

export type FlyerConcept = {
  id: number;
  label: string;
  description: string;
};

export type LocalFileItem = {
  id: string;
  file: File;
  previewUrl: string;
};

export type MinisterLocalRow = {
  id: string;
  avatar: LocalFileItem;
  name: string;
  title: string;
  placeholderName: string;
  placeholderTitle: string;
};

type CreateDesignState = {
  eventDetails: EventDetails;
  setEventDetails: (next: EventDetails) => void;

  logos: LocalFileItem[];
  setLogos: (next: LocalFileItem[]) => void;

  ministers: MinisterLocalRow[];
  setMinisters: (next: MinisterLocalRow[]) => void;

  conceptsKey: string;
  setConceptsKey: (next: string) => void;

  concepts: FlyerConcept[];
  setConcepts: (next: FlyerConcept[]) => void;

  selectedConceptId: number | null;
  setSelectedConceptId: (next: number | null) => void;
};

const defaultEventDetails: EventDetails = {
  churchName: "",
  date: "",
  time: "",
  eventName: "",
  venue: "",
  theme: "",
  otherInfo: "",
};

const Ctx = createContext<CreateDesignState | null>(null);

export function CreateDesignProvider({ children }: { children: React.ReactNode }) {
  const [eventDetails, setEventDetails] = useState<EventDetails>(defaultEventDetails);
  const [logos, setLogos] = useState<LocalFileItem[]>([]);
  const [ministers, setMinisters] = useState<MinisterLocalRow[]>([]);
  const [conceptsKey, setConceptsKey] = useState<string>("");
  const [concepts, setConcepts] = useState<FlyerConcept[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<number | null>(null);

  const value = useMemo<CreateDesignState>(
    () => ({
      eventDetails,
      setEventDetails,
      logos,
      setLogos,
      ministers,
      setMinisters,
      conceptsKey,
      setConceptsKey,
      concepts,
      setConcepts,
      selectedConceptId,
      setSelectedConceptId,
    }),
    [concepts, conceptsKey, eventDetails, logos, ministers, selectedConceptId]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCreateDesign() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCreateDesign must be used within CreateDesignProvider");
  return ctx;
}


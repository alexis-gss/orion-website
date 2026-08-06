import { useSyncExternalStore } from "react";
import { domains, type Domain, type DomainId } from "@/data/domains";

let current: Domain = domains[0]!;
const listeners = new Set<() => void>();

function getSnapshot(): Domain {
  return current;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setActiveDomain(id: DomainId): void {
  const next = domains.find((domain) => domain.id === id);

  if (!next || next.id === current.id) return;

  current = next;
  listeners.forEach((listener) => listener());
}

export function useActiveDomain(): Domain {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

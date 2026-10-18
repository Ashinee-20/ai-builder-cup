import "server-only";
import { Firestore } from "@google-cloud/firestore";
import type { SavedPlanningWorkspace } from "@/lib/planning";

let firestore: Firestore | undefined;

function db() {
  firestore ??= new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT,
    databaseId: process.env.FIRESTORE_DATABASE_ID || "(default)",
  });
  return firestore;
}

export async function saveWorkspace(workspace: SavedPlanningWorkspace) {
  await db().collection("chalkevo_workspaces").doc("public_demo").set(workspace);
}

export async function loadWorkspace(): Promise<SavedPlanningWorkspace | null> {
  const snapshot = await db().collection("chalkevo_workspaces").doc("public_demo").get();
  return snapshot.exists ? snapshot.data() as SavedPlanningWorkspace : null;
}


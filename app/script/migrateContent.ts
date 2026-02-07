import { collection, doc, writeBatch } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import { contentsData } from "~/data/contentData";

export const migrateContentToFirestore = async () => {
  if (!contentsData || contentsData.length === 0) {
    const message = "No mock data found to migrate.";
    console.error(message);
    alert(message);
    return;
  }

  console.log("Starting content migration to Firestore...");

  try {
    const batch = writeBatch(firestore);
    const contentsCollectionRef = collection(firestore, "contents");

    console.log(`Found ${contentsData.length} content items to migrate.`);

    contentsData.forEach((content) => {
      const docRef = doc(contentsCollectionRef, content.id);
      batch.set(docRef, content);
    });

    await batch.commit();

    const successMessage = "Successfully migrated content data to Firestore!";
    console.log(successMessage);
    alert(successMessage);
  } catch (error) {
    const errorMessage = `Content migration failed: ${error}`;
    console.error(errorMessage);
    alert(errorMessage);
  }
};

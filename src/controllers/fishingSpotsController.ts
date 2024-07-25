import { Request, Response } from "express";
import { connectDatabase } from "@config/database";
import { FishingSpotProps } from "@namespace/fishing-spots";

import { Collection, CollectionInfo, ObjectId } from "mongodb";
import { commonMessages } from "@utils/constants";
import {
  buildFilterQuery,
  buildSortObject,
  parseQueryArray,
} from "@utils/functions/table";
import { capitalizeFirstLetter } from "@utils/functions/words";

const baseDatabaseName = "spots";

export const getAllFishingSpots = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseDatabaseName);

    if (!db) {
      res.status(404).json({ message: "Brak listy łowisk w bazie danych" });
      return;
    }

    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = parseInt(req.query.take as string, 10) || 10;

    // Log raw query parameters
    console.log("Raw Query Parameters:", req.query);

    // Parse filters and sortings from query parameters
    const filters = (req.query.filters as string[]) || [];
    const sortings = (req.query.sortings as string[]) || [];

    console.log("Filters:", filters);
    console.log("Sortings:", sortings);

    // Convert the query parameters to the correct format
    const parsedFilters = parseQueryArray(filters);
    const parsedSortings = parseQueryArray(sortings);

    const filterQuery = buildFilterQuery(parsedFilters);
    const sortObject = buildSortObject(parsedSortings);

    console.log("Skip:", skip);
    console.log("Take:", take);
    console.log("Parsed Filters:", parsedFilters);
    console.log("Parsed Sortings:", parsedSortings);
    console.log("Filter Query:", filterQuery);
    console.log("Sort Object:", sortObject);

    const collections: (CollectionInfo | Pick<CollectionInfo, "name">)[] =
      await db.listCollections().toArray();

    const allData: FishingSpotProps[] = [];

    for (const collectionInfo of collections) {
      const collection: Collection<FishingSpotProps> | undefined =
        db.collection<FishingSpotProps>(collectionInfo.name);

      const documents: FishingSpotProps[] = await collection
        .find(filterQuery)
        .sort(sortObject)
        .skip(skip)
        .limit(take)
        .toArray();

      const processedDocuments = documents.map(
        ({ geolocation, ...restItem }) => ({
          ...restItem,
          district: capitalizeFirstLetter(restItem?.district),
          isNoKill: restItem.type === "Łowiska złow i wypuść",
        })
      );

      allData.push(...processedDocuments);
    }

    res.status(200).json({ items: allData, totalItems: allData.length });
  } catch (error) {
    console.error("Błąd podczas pobierania danych dla łowisk", error);
    res.status(500).json({
      message:
        "Wystąpił błąd podczas przesyłania danych, proszę spróbować później",
    });
  }
};

export const getFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase("spots");

    if (!db) {
      res.status(404).json({ message: "Database connection failed" });
      return;
    }

    const { area, id } = req.params;

    // Ensure collection exists
    const collections = await db.listCollections({ name: area }).toArray();
    if (collections.length === 0) {
      res.status(404).json({ message: `Nie znaleziono okręgu "${area}"` });
      return;
    }

    // Find the document by id in the specified collection
    const collection = db.collection<FishingSpotProps>(area);
    const foundSpot = await collection.findOne({ _id: new ObjectId(id) });

    if (!foundSpot) {
      res.status(404).json({
        message: `Nie znaleziono łowiska w okręgu ${area} o identyfikatorze ${id}`,
      });
      return;
    }

    res.status(200).json(foundSpot);
  } catch (error) {
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

export const createFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const db = await connectDatabase(baseDatabaseName);

  if (!req.body) {
    res
      .status(400)
      .json({ message: 'Brak danych w żądaniu o parametrze "body"' });
    return;
  }

  try {
    const requestBody: FishingSpotProps = req.body;

    const collection = db?.collection(requestBody.district);

    // Check if a spot with the same name or code already exists
    const existingSpot = await collection?.findOne({
      $or: [{ name: requestBody.name }, { code: requestBody.code }],
    });

    if (existingSpot) {
      res.status(409).json({
        message: `Łowisko ${requestBody.name} (kod: ${requestBody.code}) już istnieje w okręgu ${requestBody.district}`,
      });
      return;
    }

    const uploadedData = await collection?.insertOne(requestBody);

    res.status(200).json({ ...requestBody, _id: uploadedData?.insertedId });
  } catch (error) {
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

export const updateFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase("spots");

    if (!db) {
      res.status(404).json({ message: "Database connection failed" });
      return;
    }

    const { area, id } = req.params;
    const updateData = req.body;

    // Ensure collection exists
    const collection = db.collection<FishingSpotProps>(area);

    // Ensure _id is not in updateData
    delete updateData._id;

    const fieldId = new ObjectId(id);

    // Update based on id (assuming id is your custom identifier)
    const result = await collection.updateOne(
      { _id: fieldId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res
        .status(404)
        .json({ message: "No fishing spot found with the given ID" });
      return;
    }

    const updatedSpot = await collection.findOne({ _id: fieldId });
    res.status(200).json(updatedSpot);
  } catch (error) {
    console.error("Error while updating fishing spot:", error);
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

export const deleteFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase("spots");

    if (!db) {
      res.status(404).json({ message: "Database connection failed" });
      return;
    }

    const { area, id } = req.params;

    // Ensure collection exists
    const collections = await db.listCollections({ name: area }).toArray();
    if (collections.length === 0) {
      res
        .status(404)
        .json({ message: "No collection found for the given area" });
      return;
    }

    // Delete the document by id in the specified collection
    const collection = db.collection<FishingSpotProps>(area);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res
        .status(404)
        .json({ message: "No fishing spot found with the given ID" });
      return;
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

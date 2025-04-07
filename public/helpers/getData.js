// A demonstration of how to access data from a local, public file
export const getData = async (url) => {
  try {
    const response = await fetch(url);
    console.log("fetching a client-side data file", response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("extracting the legos", data);

    // Return the data so it can be used
    return data;
  } catch (error) {
    console.error("Error in getData:", error);
    throw error; // Re-throw to handle in calling code
  }
};

// A demonstration of how to access data from a local, public file
export const getData = async (url) => {
  try {
    if (Object.hasOwn(cache, url)) {
      console.log("returning data from cache");
      return cache[url];
    }

    const response = await fetch(url);
    console.log("fetching a data from server", response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("extracting response json", data);

    // Save data to cache
    cache[url] = data.data;

    // Return the data so it can be used
    return data.data;
  } catch (error) {
    console.error("Error in getData:", error);
    throw error; // Re-throw to handle in calling code
  }
};

const cache = {};

export const getRandomIntInclusive = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
};

export const getOrInitializeMapValue = (map, key, defaultValue) => {
  if (!map.has(key)) {
    map.set(key, defaultValue);
  }

  return map.get(key);
};

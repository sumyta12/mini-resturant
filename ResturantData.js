export default async function dataMealinfo() {
  const url = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );

  return await url.json();
}

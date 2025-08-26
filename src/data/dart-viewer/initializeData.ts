export async function initializeData() {
  const sectionFiles = [
    "section-1.html",
    "section-2.html",
    "section-3.html",
    "section-4.html",
    "section-5.html",
    "section-6.html",
  ];

  const sectionsData: Record<string, string> = {};

  for (let i = 0; i < sectionFiles.length; i++) {
    const res = await fetch(`/initialTemplate/${sectionFiles[i]}`);
    sectionsData[`section${i + 1}`] = await res.text();
  }

  return sectionsData;
}

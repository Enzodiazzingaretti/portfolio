import { describe, expect, it } from "vitest";
import { prefijoDe, rutaEn, sinPrefijo } from "../src/idiomaRuta";

describe("idioma por URL", () => {
  it("reconoce el prefijo solo como segmento entero", () => {
    expect(prefijoDe("/en")).toBe("en");
    expect(prefijoDe("/pt/grafica/sonar-produce")).toBe("pt");
    expect(prefijoDe("/motion")).toBeNull();
    expect(prefijoDe("/entrevistas")).toBeNull();
    expect(prefijoDe("/")).toBeNull();
  });

  it("lleva la misma página a otro idioma", () => {
    expect(rutaEn("en", "/motion")).toBe("/en/motion");
    expect(rutaEn("pt", "/en/tech/portfolio")).toBe("/pt/tech/portfolio");
    expect(rutaEn("es", "/pt/3d")).toBe("/3d");
    expect(rutaEn("en", "/")).toBe("/en");
    expect(rutaEn("es", "/en")).toBe("/");
    expect(sinPrefijo("/en")).toBe("/");
  });
});

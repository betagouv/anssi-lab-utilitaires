import {afterEach, beforeEach, expect, describe, it, vi} from "vitest";
import type {Mock} from "vitest";
import {aseptiseMarkdown, fabriqueFormatagePayload} from "../../src/formatage/formatagePayload";

const formatagePayload = fabriqueFormatagePayload(aseptiseMarkdown);

describe('Le formatage des payload', () => {
    it('remplace les balises du template par les données passées', () => {
        const template = '{a} et {b}';
        const donnees = {a: 1, b: 2};
        expect(formatagePayload(template, donnees)).toEqual('1 et 2');
    });

    it('remplace les balises du template par les données de n-ème niveau passées', () => {
        const template = '{a.b} et {c.d.e}';
        const donnees = {
            a: {
                b: 'B'
            },
            c: {
                d: {
                    e: 'E'
                }
            }
        };
        expect(formatagePayload(template, donnees)).toEqual('B et E');
    });

    it('reste robuste si la même valeur est utilisée plusieurs fois', () => {
        const template = '{a} et {a}';
        const donnees = {a: 1};
        expect(formatagePayload(template, donnees)).toEqual('1 et 1');
    });

    it("reste robuste si la clé comporte des caractères spéciaux", () => {
        const template = "{ma_cle_123}";
        const donnees = { ma_cle_123: 1 };
        expect(formatagePayload(template, donnees)).toEqual("1");
    });

    it("applique l'aseptisation du markdown sur le contenu injecté", () => {
      const espion = vi.fn((_) => "");
      const formatagePayloadAvecAseptisationDuMarkdownMockee = fabriqueFormatagePayload(espion);

      const contenuAAseptiser = "# coucou";
      const template = "{a}";
      const donnees = { a: contenuAAseptiser };

      formatagePayloadAvecAseptisationDuMarkdownMockee(template, donnees);

      expect(espion).toHaveBeenCalledExactlyOnceWith(contenuAAseptiser);
    });

    describe("n'aseptise pas les valeurs des cles specifiees", () => {
      let espion: Mock<(x: unknown) => string>;

      beforeEach(() => {
        espion = vi.fn((_) => "");
      });

      afterEach(() => {
        vi.clearAllMocks();
      });

      it('avec une seule cle', () => {
        const formatagePayloadAvecAseptisationDuMarkdownMockee = fabriqueFormatagePayload(espion);

        const template = "{a}";
        const donnees = { a: "coucou" };
        const aNePasAseptiser = ["a"];

        formatagePayloadAvecAseptisationDuMarkdownMockee(template, donnees, aNePasAseptiser);

        expect(espion).not.toHaveBeenCalled();
      });

      it('avec plusieurs cle', () => {
        const formatagePayloadAvecAseptisationDuMarkdownMockee = fabriqueFormatagePayload(espion);

        const template = "{a}, {b}";
        const donnees = { a: "coucou", b: "bonjour" };
        const aNePasAseptiser = ["a", "b"];

        formatagePayloadAvecAseptisationDuMarkdownMockee(template, donnees, aNePasAseptiser);

        expect(espion).not.toHaveBeenCalled();
      });

      it('avec plusieurs cle, mais certaines doivent tout de même être aseptisées', () => {
        const formatagePayloadAvecAseptisationDuMarkdownMockee = fabriqueFormatagePayload(espion);

        const contenuAAseptiser = "bonjour";
        const template = "{a}, {b}";
        const donnees = { a: "coucou", b: contenuAAseptiser };
        const aNePasAseptiser = ["a"];

        formatagePayloadAvecAseptisationDuMarkdownMockee(template, donnees, aNePasAseptiser);

        expect(espion).toHaveBeenCalledExactlyOnceWith(contenuAAseptiser);
      });

      it('avec une cle ciblant un niveau profond', () => {
        const formatagePayloadAvecAseptisationDuMarkdownMockee = fabriqueFormatagePayload(espion);

        const template = "{a.b}";
        const donnees = { a: { b: "bonjour" } };
        const aNePasAseptiser = ["a.b"];

        formatagePayloadAvecAseptisationDuMarkdownMockee(template, donnees, aNePasAseptiser);

        expect(espion).not.toHaveBeenCalled();
      });
    });
});

describe("Le markdown", () => {
  it("retourne la chaîne intacte lorsqu'elle ne contient aucun caractère spécial", () => {
    const markdown = aseptiseMarkdown("bonjour tout le monde");

    expect(markdown).toEqual("bonjour tout le monde");
  });

  ["!", "\\", "[", "]", "`", "{", "}", "*", "_", "<", ">", "(", ")", "#", "+", "-", ".", "|"].forEach((caractereAEchapper) =>
          it(`échappe les ${caractereAEchapper}`, () => {
              const markdown = aseptiseMarkdown(caractereAEchapper);

              expect(markdown).toEqual(`\\${caractereAEchapper}`);
          }),
        );
});

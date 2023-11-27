import {expect, describe, it} from "vitest";
import {formatagePayload} from "../../src/formatage/formatagePayload";

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

    it('reste robuste si la clé comporte des caractères spéciaux', () => {
        const template = '{ma_cle_123}';
        const donnees = {'ma_cle_123': 1};
        expect(formatagePayload(template, donnees)).toEqual('1');
    });
})
import {expect, describe, it} from "vitest";
import {formatagePayload} from "../../src/formatage/formatagePayload";

describe('Le formatage des payload', () => {
    it('remplace les balises du template par les données passées', () => {
        const template = '{a} et {b}';
        const donnees = {a: 1, b: 2};
        expect(formatagePayload(template, donnees)).toEqual('1 et 2');
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
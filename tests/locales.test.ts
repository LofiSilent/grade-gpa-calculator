
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  messages,
  translate,
  localizedDecimal,
  type Locale,
  type MessageKey,
} from "../src/locales.ts";
for (const locale of ["ru", "kk", "en"] as Locale[]) {
  test(`${locale}: every message has a translation and resolves parameters`, () => {
    assert.deepEqual(
      Object.keys(messages[locale]).sort(),
      Object.keys(messages.en).sort(),
    );
    for (const key of Object.keys(
      messages.en,
    ) as (keyof typeof messages.en)[]) {
      assert.ok(messages[locale][key].trim().length > 0);
      assert.ok(
        !translate(locale, key as MessageKey, { n: 3, gpa: "2.94" }).includes(
          "{",
        ),
      );
    }
  });

}
test("localized decimal display keeps exact rounded digits", () => {
  assert.equal(localizedDecimal("3.01", "ru"), "3,01");
  assert.equal(localizedDecimal("3.01", "kk"), "3,01");
  assert.equal(localizedDecimal("3.01", "en"), "3.01");
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { IconPicker } from "@/components/categories/IconPicker";

const user = userEvent.setup();

describe("IconPicker", () => {
  it("filters icons by search and selects", async () => {
    let selected = "";
    render(<IconPicker value={selected} onChange={(key) => { selected = key; }} />);

    await user.click(screen.getByRole("button", { name: /choose icon/i }));
    const search = screen.getByLabelText(/search icons/i);
    await user.type(search, "coffee");

    const option = screen.getByRole("button", { name: /select coffee icon/i });
    await user.click(option);

    expect(selected).toBe("coffee");
  });
});

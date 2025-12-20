import { describe, expect, it, vi } from "vitest";

import { TypedEventEmitter } from "#/components/go/typed-event-emitter.ts";
import { nextEventLoop } from "#tests/utils/unit-test-utils.ts";


class TestEventEmitter extends TypedEventEmitter<{ "test-event": undefined }> {
  public dispatchTestEvent(): void  {
    this.dispatchCustomEvent("test-event");
  }
}


describe("TypedEventEmitter", () => {

  it("should emit events", async () => {
    const emitter = new TestEventEmitter();
    const listener = vi.fn();
    emitter.addEventListener("test-event", listener);
    emitter.dispatchTestEvent();

    expect(listener).not.toHaveBeenCalled();

    await nextEventLoop();

    expect(listener).toHaveBeenCalledTimes(1);
  });

});

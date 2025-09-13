import { describe, it, expect, vi } from "vitest";
import { nextEventLoop } from "../unit-test-utils.ts";
import { TypedEventEmitter } from "@/components/playground/go/TypedEventEmitter.ts";


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

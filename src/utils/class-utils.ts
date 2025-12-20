type PrimitiveValue =
  string |
  boolean |
  number |
  null |
  undefined;


type ClassnamesArgumentValue = 
  PrimitiveValue |
  PrimitiveValue[] |
  Record<string, boolean | null | undefined>;


export function classnames(...args: ClassnamesArgumentValue[]): string {
  let classes = new Set<string>();

  for(const argVal of args) {
    handleArgumentValue(argVal, classes);
  }

  return Array.from(classes).join(" ");
}


function handleArgumentValue(argVal: ClassnamesArgumentValue, classes: Set<string>): void {
  if(!isValidArgumentValue(argVal)) {
    return;
  }
  else if(Array.isArray(argVal)) {
    for(const subArgVal of argVal) {
      handleArgumentValue(subArgVal, classes);
    }
  }
  else if(typeof argVal === "object") {
    for(const [key, val] of Object.entries(argVal)) {
      if(isValidArgumentValue(val)) {
        classes.add(key);
      }
    }
  }
  else {
    classes.add(`${argVal}`);
  }
}


function isValidArgumentValue(argVal: ClassnamesArgumentValue): argVal is NonNullable<ClassnamesArgumentValue> {
  return argVal !== "" &&  argVal !== false && argVal !== null && argVal !== undefined;
}

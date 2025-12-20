import type { JSX, MouseEvent } from "react";
import { Fragment, StrictMode, useCallback, useEffect, useRef, useState } from "react";

import "./table-of-contents.scss";


export interface TableOfContentsModelNode {
  headingType: number
  id?: string
  text: string
  children: TableOfContentsModelNode[]
  parent?: TableOfContentsModelNode
  depth: number
}

export interface Props {
  targetQuerySelector: string
  tableTitle?: string
}


const headingTypeMap: Record<string, number> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6
};


export default function TableOfContentsWrapper(props: Props): JSX.Element {
  return (
    <StrictMode>
      <TableOfContents {...props} />
    </StrictMode>
  );
}


function TableOfContents(props: Props): JSX.Element {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [model, setModel] = useState<TableOfContentsModelNode[]>([]);
  const updateModel = useCallback(
    () => setModel(buildTableOfContentsModel(target)),
    [ target ]
  );
  const mutationObserverRef = useRef(
    new MutationObserver(updateModel)
  );

  useEffect(() => {
    const newTarget = props.targetQuerySelector
      ? document.querySelector<HTMLElement>(props.targetQuerySelector)
      : null;
    setTarget(newTarget);
  }, [ props.targetQuerySelector ]);

  useEffect(() => {
    updateModel();

    if(!target) {
      return;
    }

    mutationObserverRef.current.observe(target, {
      subtree: true,
      childList: true
    });

    return () => mutationObserverRef.current.disconnect();
  }, [ target ]);
  
  return (
    <div className="table-of-contents">
      {
        props.tableTitle && (
          <strong>{props.tableTitle}</strong>
        )
      }

      {
        model.length > 0 && (
          <ol className="depth-0">
            { model.map(renderModelNode) }
          </ol>
        )
      }
    </div>
  );
}


function buildTableOfContentsModel(target: HTMLElement | null): TableOfContentsModelNode[] {
  const newModel: TableOfContentsModelNode[] = [];
  let cur: TableOfContentsModelNode | undefined;

  const headings = target?.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4, h5, h6") ?? [] as HTMLHeadingElement[];

  for(const heading of headings) {
    const newNode: TableOfContentsModelNode = {
      headingType: getHeadingType(heading),
      id: heading.id || undefined,
      text: heading.textContent || "",
      children: [],
      depth: -1
    };

    while(cur && newNode.headingType <= cur.headingType) {
      cur = cur.parent;
    }

    if(!cur) {
      newNode.depth = 0;
      newModel.push(newNode);
    } else {
      newNode.parent = cur;
      newNode.depth = cur.depth + 1;
      cur.children.push(newNode);
    }

    cur = newNode;
  }

  return newModel;
}


function getHeadingType(heading: HTMLHeadingElement): number {
  const headingType = heading.tagName.toLowerCase();
  return headingTypeMap[headingType] ?? -1;
}


function onLinkClicked(e: MouseEvent<HTMLAnchorElement>): void {
  e.preventDefault();

  const eventTarget = e.currentTarget;
  const href = eventTarget.getAttribute("href") ?? "";
  const hashIndex = href.lastIndexOf("#");

  if(hashIndex === -1) {
    return;
  }

  const targetId = href.substring(hashIndex + 1);
  if (targetId) {
    const targetElement = document.getElementById(targetId);
    targetElement?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${targetId}`);
  }
} 


function renderModelNode(node: TableOfContentsModelNode): JSX.Element {
  return (
    <Fragment key={getNodeRenderKey(node)}>
      <li>
        {
          node.id 
            ? <a href={`#${node.id}`} onClick={onLinkClicked}>{node.text}</a>
            : <span>{node.text}</span>
        }
      </li>

      {
        node.children.length ? (
          <ol className={`depth-${node.depth + 1}`}>
            { node.children.map(renderModelNode) }
          </ol>
        ) : null
      }
    </Fragment>
  );
}

function getNodeRenderKey(node: TableOfContentsModelNode): string {
  let renderKey = `{id:"${node.id}",headingType:${node.headingType},text:"${node.text}"}`;
  if(node.parent) {
    renderKey = `${getNodeRenderKey(node.parent)} > ${renderKey}`;
  }
  return renderKey;
}

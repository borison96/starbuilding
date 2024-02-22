import React, { useRef }  from 'react';
import type { TreeNodeProps } from '../../../typings';
import icons from '../../../asset/svg';
type IconName = keyof typeof icons;
function TreeNode(props: TreeNodeProps) {
    const ref = useRef<SVGSVGElement>(null);
    const { nodeDatum, d3ExtraProps, setActive, activeNodes, active, toggleNode, setEmptyNodePlacement, ...others } = props;
    const { id, nodeType, iconName } = nodeDatum.attributes;
    const isActiveParent = activeNodes && activeNodes[id];
    const isActive = active === id;
    const { hierarchyPointNode } = d3ExtraProps;
    const isMyParentActive = hierarchyPointNode?.parent?.data?.attributes?.id === active || hierarchyPointNode?.parent === null;
    let fill = isActive ? "#295EA7" : "#fff";
    const isEmpty = nodeType === "empty";
    let textFill = "";
    let size = props.nodeSize ?? 52;
    let icon = icons.question;;
    if(isEmpty) {
      fill = "#F3BE3D";
    }
    if (iconName in icons) {
      icon = icons[iconName as IconName];
    } else if (nodeType in icons) {
      icon = icons[nodeType as IconName];
    }
    if (!isActiveParent) {
      textFill = "#959595"
    } else {
      textFill = isActive ? "#555" : "#295EA7";
    }
    const handleClick = (event: any) => {
        if (hierarchyPointNode?.data?.__rd3t?.collapsed) {
          toggleNode(event);
        }
        if (typeof setActive === 'function' && !isEmpty) {
          setActive(hierarchyPointNode);
        }
        if (setEmptyNodePlacement && isEmpty) {
          setEmptyNodePlacement({
            showForm: true,
            node: hierarchyPointNode,
            el: ref?.current,
          });
        }
    }
    return (isEmpty && !isMyParentActive) ? null : (
      <svg
          //style={{ cursor: hasChildren ? 'pointer' : 'default' }}
          x={-size / 2}
          y={-size / 2}
          viewBox={`0 0 ${size + 5} ${size + 5}`}
          width={size + 5}
          height={size + 5}
          onClick={handleClick}
          ref={ref}
        >
            <g id={`tree-node-${id}`}>
                <circle
                  fill={fill}
                  cy={size / 2}
                  cx={size / 2}
                  id={id}
                  r={(size / 2) - (isActiveParent && !isActive ? 3 : 0)}
                  strokeWidth={isActiveParent && !isActive ? 3 : 0}
                  stroke={"#295EA7"}
                />
                <image
                  viewBox={`0 0 ${size} ${size}`}
                  x="20%"y="20%"
                  xlinkHref={icon}
                  width="50%"
                  height="50%"
                  preserveAspectRatio="xMidYMid slice"
                />
                <text
                  y={size / 2}
                  x={size / 2}
                  strokeWidth={0}
                  fontSize={10}
                  fill={textFill}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                >
                {nodeDatum?.name?.length > 9 ? nodeDatum?.name?.substring(0, 7) + "..." : nodeDatum?.name }
            </text>
            </g>
            {
              !isEmpty && hierarchyPointNode?.data?.children?.length > 1 && (
                  <text
                    viewBox={`0 0 ${size} ${size}`}
                    x="75%"y="100%"
                    width="60%"
                    height="60%"
                    strokeWidth={0}
                    fontSize={25}
                    fill={fill}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(e);
                    }}
                  >
                    { hierarchyPointNode?.data?.__rd3t?.collapsed ? '+' : '-' }
                  </text>
              )
            }
            <title>
                {nodeDatum.attributes?.description}
            </title>

        </svg>
    );
}

export default TreeNode;

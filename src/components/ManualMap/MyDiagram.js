import React from "react";
import * as go from "gojs";
import { ToolManager, Diagram } from "gojs";
import { GojsDiagram, ModelChangeEventType } from "react-gojs";
import DiagramButtons from "./DiagramButtons";
import "./MyDiagram.css";
import { getRandomColor } from "../Helpers/ColorHelper";
import { getSwitchType} from "../../views/Dashboard/matrixOperations"
import Swal from "sweetalert2";

class MyDiagram extends React.Component {
  nodeId = 0;
  componentDidMount() {
    this.initModelHandler();
  }

  constructor(props) {
    super(props);
    this.createDiagram = this.createDiagram.bind(this);
    this.modelChangeHandler = this.modelChangeHandler.bind(this);
    this.initModelHandler = this.initModelHandler.bind(this);
    this.updateColorHandler = this.updateColorHandler.bind(this);
    this.nodeSelectionHandler = this.nodeSelectionHandler.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.addNode = this.addNode.bind(this);
    this.updateNodeText = this.updateNodeText.bind(this);
    this.onTextEdited = this.onTextEdited.bind(this);
    this.state = {
      selectedNodeKeys: [],
      model: {
        nodeDataArray: [{ key: "Alpha", label: "Alpha", color: "lightblue" }],
        linkDataArray: []
      }
    };
  }

  render() {
    return [
      <DiagramButtons
        key="diagramButtons"
        onInit={this.initModelHandler}
        onUpdateColor={this.updateColorHandler}
        onAddNode={this.addNode}
      />,
      
      <GojsDiagram
        key="gojsDiagram"
        diagramId="myDiagramDiv"
        model={this.state.model}
        createDiagram={this.createDiagram}
        className="myDiagram"
        onModelChange={this.modelChangeHandler}
      />
    ];
  }

  initModelHandler() {
    this.setState({
      ...this.state,
      model: {
        nodeDataArray: [
          { key: "Feeder1", label: "Primary1", color: "lightblue" },
          { key: "Feeder2", label: "Primary2", color: "lightblue" },
          { key: "Feeder3", label: "Primary3", color: "lightblue" },
          { key: "Feeder4", label: "Primary4", color: "lightblue" },
          { key: "sw1010", label: "sw1010", color: "lightgreen" },
          { key: "sw1011", label: "sw1011", color: "lightgreen" },
          { key: "sw1012", label: "sw1012", color: "red" },
          { key: "sw1018", label: "sw1018", color: "lightgreen" },
          { key: "sw1014", label: "sw1014", color: "lightgreen" },
          { key: "sw1015", label: "sw1015", color: "red" },
          { key: "sw1016", label: "sw1016", color: "red" },
          { key: "sw1017", label: "sw1017", color: "lightgreen" },
          { key: "sw1018", label: "sw1018", color: "red" },
          { key: "sw1019", label: "sw1019", color: "lightgreen" },
          { key: "sw1020", label: "sw1020", color: "lightgreen" },
          { key: "sw1021", label: "sw1021", color: "lightgreen" },
          { key: "sw1022", label: "sw1022", color: "red" },
          { key: "sw1023", label: "sw1023", color: "red" },
          { key: "sw1024", label: "sw1024", color: "lightgreen" },
          { key: "sw1025", label: "sw1025", color: "lightgreen" },
          { key: "sw1026", label: "sw1026", color: "lightgreen" },
          { key: "sw1027", label: "sw1027", color: "lightgreen" },
          { key: "sw1028", label: "sw1028", color: "red" },
          { key: "sw1029", label: "sw1029", color: "red" },
          { key: "sw1030", label: "sw1030", color: "red" },
          { key: "sw1031", label: "sw1031", color: "lightgreen" },
          { key: "sw1032", label: "sw1032", color: "lightgreen" },
          { key: "sw1033", label: "sw1033", color: "lightgreen" },
          { key: "sw1034", label: "sw1034", color: "lightgreen" },
          { key: "sw1035", label: "sw1035", color: "red" },
          { key: "sw1036", label: "sw1036", color: "lightgreen" },
          { key: "sw1037", label: "sw1037", color: "red" },
          { key: "sw1038", label: "sw1038", color: "lightgreen" },
          { key: "sw1039", label: "sw1039", color: "lightgreen" },
          { key: "sw1040", label: "sw1040", color: "lightgreen" },
          { key: "sw1041", label: "sw1041", color: "lightgreen" },
          { key: "sw1042", label: "sw1042", color: "lightgreen" },
          { key: "sw1043", label: "sw1043", color: "lightgreen" },
          { key: "sw1044", label: "sw1044", color: "lightgreen" },
          { key: "sw1045", label: "sw1045", color: "lightgreen" },
          { key: "sw1046", label: "sw1046", color: "lightgreen" },
          { key: "sw1047", label: "sw1047", color: "lightgreen" }
        ],
        linkDataArray: [
          { from: "Feeder1", to: "sw1027" },
          { from: "Feeder1", to: "sw1026" },
          { from: "Feeder1", to: "sw1025" },
          { from: "sw1027", to: "sw1028" },
          { from: "sw1028", to: "sw1029" },
          { from: "sw1029", to: "sw1030" },
          { from: "sw1030", to: "sw1031" },
          { from: "sw1030", to: "sw1032" },
          { from: "sw1026", to: "sw1032" },
          { from: "sw1025", to: "sw1024" },
          { from: "sw1025", to: "sw1035" },
          { from: "sw1035", to: "sw1034" },
          { from: "sw1031", to: "sw1033" },
          { from: "sw1034", to: "sw1033" },
          { from: "sw1032", to: "sw1030" },
          { from: "sw1024", to: "sw1036" },
          { from: "sw1010", to: "sw1036" },
          { from: "Feeder2", to: "sw1010" },
          { from: "sw1010", to: "sw1012" },
          { from: "sw1012", to: "sw1013" },
          { from: "Feeder2", to: "sw1011" },
          { from: "sw1011", to: "sw1013" },
          { from: "sw1013", to: "sw1014" },

          { from: "Feeder3", to: "sw1019" },
          { from: "Feeder3", to: "sw1020" },
          { from: "Feeder3", to: "sw1021" },
          { from: "sw1019", to: "sw1018" },
          { from: "sw1018", to: "sw1014" },
          { from: "sw1018", to: "sw1016" },
          { from: "sw1014", to: "sw1015" },
          { from: "sw1020", to: "sw1022" },
          { from: "sw1020", to: "sw1017" },
          { from: "sw1021", to: "sw1022" },
          { from: "sw1021", to: "sw1023" },
          { from: "sw1022", to: "sw1021" },
          { from: "sw1023", to: "sw1037" },

          { from: "Feeder4", to: "sw1039" },
          { from: "Feeder4", to: "sw1040" },
          { from: "Feeder4", to: "sw1041" },
          { from: "sw1039", to: "sw1042" },
          { from: "sw1040", to: "sw1042" },
          { from: "sw1039", to: "sw1038" },
          { from: "sw1038", to: "sw1037" },
          { from: "sw1042", to: "sw1043" },
          { from: "sw1043", to: "sw1044" },

          { from: "sw1041", to: "sw1045" },
          { from: "sw1045", to: "sw1047" },
          { from: "sw1045", to: "sw1046" },
          { from: "sw1043", to: "sw1044" },
          { from: "sw1043", to: "sw1044" }
        ]
      }
    });
  }

  updateColorHandler() {
    const updatedNodes = this.state.model.nodeDataArray.map(node => {
      return {
        ...node,
        color: getRandomColor()
      };
    });

    this.setState({
      ...this.state,
      model: {
        ...this.state.model,
        nodeDataArray: updatedNodes
      }
    });
  }

  createDiagram(diagramId: string) {
    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, diagramId, {
      initialContentAlignment: go.Spot.LeftCenter,
      layout: $(go.TreeLayout, {
        angle: 0,
        arrangement: go.TreeLayout.ArrangementVertical,
        treeStyle: go.TreeLayout.StyleLayelightgreen
      }),
      isReadOnly: false,
      allowHorizontalScroll: true,
      allowVerticalScroll: true,
      allowZoom: false,
      allowSelect: true,
      autoScale: Diagram.Uniform,
      contentAlignment: go.Spot.LeftCenter,
      TextEdited: this.onTextEdited
    });

    myDiagram.toolManager.panningTool.isEnabled = false;
    myDiagram.toolManager.mouseWheelBehavior = ToolManager.WheelScroll;

    myDiagram.nodeTemplate = $(
      go.Node,
      "Auto",
      {
        selectionChanged: node =>
          this.nodeSelectionHandler(node.key, node.isSelected, this.props.no_list, this.props.feed_list, this.props.crnt_tbl, this.props.sw_list)
      },
      $(
        go.Shape,
        "RoundedRectangle",
        { strokeWidth: 0 },
        new go.Binding("fill", "color")
      ),
      $(
        go.TextBlock,
        { margin: 8, editable: true },
        new go.Binding("text", "label")
      )
    );

    return myDiagram;
  }

  modelChangeHandler(event) {
    switch (event.eventType) {
      case ModelChangeEventType.Remove:
        if (event.nodeData) {
          this.removeNode(event.nodeData.key);
        }
        if (event.linkData) {
          this.removeLink(event.linkData);
        }
        break;
      default:
        break;
    }
  }

  addNode() {
    const newNodeId = "node" + this.nodeId;
    const linksToAdd = this.state.selectedNodeKeys.map(parent => {
      return { from: parent, to: newNodeId };
    });
    this.setState({
      ...this.state,
      model: {
        ...this.state.model,
        nodeDataArray: [
          ...this.state.model.nodeDataArray,
          { key: newNodeId, label: newNodeId, color: getRandomColor() }
        ],
        linkDataArray:
          linksToAdd.length > 0
            ? [...this.state.model.linkDataArray].concat(linksToAdd)
            : [...this.state.model.linkDataArray]
      }
    });
    this.nodeId += 1;
  }

  removeNode(nodeKey) {
    const nodeToRemoveIndex = this.state.model.nodeDataArray.findIndex(
      node => node.key === nodeKey
    );
    if (nodeToRemoveIndex === -1) {
      return;
    }
    this.setState({
      ...this.state,
      model: {
        ...this.state.model,
        nodeDataArray: [
          ...this.state.model.nodeDataArray.slice(0, nodeToRemoveIndex),
          ...this.state.model.nodeDataArray.slice(nodeToRemoveIndex + 1)
        ]
      }
    });
  }

  removeLink(linKToRemove) {
    const linkToRemoveIndex = this.state.model.linkDataArray.findIndex(
      link => link.from === linKToRemove.from && link.to === linKToRemove.to
    );
    if (linkToRemoveIndex === -1) {
      return;
    }
    return {
      ...this.state,
      model: {
        ...this.state.model,
        linkDataArray: [
          ...this.state.model.linkDataArray.slice(0, linkToRemoveIndex),
          ...this.state.model.linkDataArray.slice(linkToRemoveIndex + 1)
        ]
      }
    };
  }

  updateNodeText(nodeKey, text) {
    const nodeToUpdateIndex = this.state.model.nodeDataArray.findIndex(
      node => node.key === nodeKey
    );
    if (nodeToUpdateIndex === -1) {
      return;
    }
    this.setState({
      ...this.state,
      model: {
        ...this.state.model,
        nodeDataArray: [
          ...this.state.model.nodeDataArray.slice(0, nodeToUpdateIndex),
          {
            ...this.state.model.nodeDataArray[nodeToUpdateIndex],
            label: text
          },
          ...this.state.model.nodeDataArray.slice(nodeToUpdateIndex + 1)
        ]
      }
    });
  }

  nodeSelectionHandler(nodeKey, isSelected, noopensw_list, feeding_list, crrntTable,sw_list) {

    if (isSelected) {
      this.setState({
        ...this.state,
        selectedNodeKeys: [...this.state.selectedNodeKeys, nodeKey]
      });
      let typef = getSwitchType(nodeKey, noopensw_list, feeding_list)
      let swCurrent = ""
      for(let i=0;i<crrntTable.length;i++){
        if(crrntTable[i][0]===nodeKey){
          swCurrent = crrntTable[i][1]
          break
        }
      }
      
      if(swCurrent===""){
        swCurrent = "Not Available"
      }

      let typeO = typef==="Close"?"Sectionalizing Switch":typef==="Open"?"Tie Switch":"Feeding Switch"

      Swal.fire({
          type: 'info',
          title: nodeKey,
          html:
        'Switch Type: <b>'+typeO+'</b>, <br>'
        +'Real Time Current (Avg.): <b>'+swCurrent+'</b>, <br>',
      showCloseButton: true,
      focusConfirm: false,
      })
    } else {
      const nodeIndexToRemove = this.state.selectedNodeKeys.findIndex(
        key => key === nodeKey
      );
      if (nodeIndexToRemove === -1) {
        return;
      }
      this.setState({
        ...this.state,
        selectedNodeKeys: [
          ...this.state.selectedNodeKeys.slice(0, nodeIndexToRemove),
          ...this.state.selectedNodeKeys.slice(nodeIndexToRemove + 1)
        ]
      });
    }
  }

  onTextEdited(e) {
    const tb = e.subject;
    if (tb === null) {
      return;
    }
    const node = tb.part;
    if (node instanceof go.Node) {
      this.updateNodeText(node.key, tb.text);
    }
  }
}

export default MyDiagram;

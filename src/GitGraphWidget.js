import React from 'react'
import GitGraph from 'react-gitgraph'
import _ from 'lodash'
import FaCodeFork from 'react-icons/lib/fa/code-fork'
import FaTag from 'react-icons/lib/fa/tag'
import FaUser from 'react-icons/lib/fa/user'

import importedData from './data/commits.json'

class GitGraphWidget extends React.Component {
  constructor(props) {
    super(props)
    this.initializeGraph = this.initializeGraph.bind(this)
    this.onCommitSelection = this.onCommitSelection.bind(this)

    this.branchStack = [];
    this.branches = [];
    this.branchesBucket = [];
    this.nodesStore = [];

    this.myTemplateConfig = { // inherited from 'metro' template
      colors: ["#979797", "#F85BB5", "#008fb5", "#f1c109", "#8fb500"],
      branch: {
        lineWidth: 4,
        spacingX: 50,
        showLabel: false,
        labelRotation: 0
      },
      commit: {
        spacingY: -40,
        dot: {
          size: 10,
        },
        message: {
          display: false,
          displayAuthor: true,
          displayBranch: true,
          displayHash: true,
          font: "normal 10pt Arial"
        },
        onClick: (commit) => this.onCommitSelection(commit),
        shouldDisplayTooltipsInCompactMode: false,
        tooltipHTMLFormatter: function ( commit ) {
          return "[" + commit.sha1 + "]: " + commit.message;
        }
      }
    }
  }

  onCommitSelection(commit) {
    alert("You clicked on commit " + commit.sha1)
  }

  commitAttributes(node) {
    return {
      dotColor: "white",
      dotSize: 4,
      dotStrokeWidth: 8,
      sha1: node.id,
      message: node.message,
      //tag: node.tag,
      author: node.author_name + "<" + node.author_email + ">",
      onClick: (commit) => this.onCommitSelection(commit)
    }
  }

  initializeGraph(gitgraph) {
//    let master = gitgraph.branch("master");
//    master.commit(this.commitAttributes({ message: "commit #1", tag: "Initial", displayTagBox: true }))
//    master.commit(this.commitAttributes({ message: "commit #2" }))
//    let develop = master.branch({ parentBranch: master, name: "develop", column: 3 })
//    master.commit(this.commitAttributes({ message: "commit #3" }))
//    let myfeature1 = develop.branch({ parentBranch: develop, name: "myfeature1", column: 2 })
//    let hotfix = master.branch({ parentBranch: master, name: "hotfix", column: 1 })
//    hotfix.commit(this.commitAttributes({ message: "commit #4" }))
//    hotfix.commit(this.commitAttributes({ message: "commit #5", tag: "v1.0.0", displayTagBox: true }))
//    myfeature1.commit(this.commitAttributes({ message: "commit #6" }))
//    hotfix.commit(this.commitAttributes({ message: "commit #7" }))
//    hotfix.merge(master, this.commitAttributes({ message: "commit #8" }))
//    hotfix.delete()
//    myfeature1.merge(master, this.commitAttributes({ message: "commit #9" }))
//    myfeature1.delete();
//    master.commit(this.commitAttributes({ message: "commit #10" }))
//    let myfeature2 = master.branch({ parentBranch: master, name: "myfeature2", column: 2 })
//    develop.commit(this.commitAttributes({ message: "commit #11" }))
//    myfeature2.commit(this.commitAttributes({ message: "commit #12" }))
//    master.commit(this.commitAttributes({ message: "commit #13" }))
//    master.commit(this.commitAttributes({ message: "commit #14" }))

    this.import(gitgraph)
    
    this.nodesStore.forEach((node,index) => {
      var branchIndex = this.findBranchFromCommit(this.branchesBucket, node.full_id)
      if (node.parentIds.length === 2) {
        branchIndex = this.findTheOtherBranchIndex(node.full_id, branchIndex, this.branchesBucket);
      }
      var row = document.getElementById("row-" + node.id).cells
      for (var i = 0; i < row.length; i++) {
        row[i].style.color = this.myTemplateConfig.colors[branchIndex]
      }
    })

    gitgraph.canvas.addEventListener( "commit:mouseover", function ( event ) {
      this.style.cursor = "pointer"
    })

    gitgraph.canvas.addEventListener("commit:mouseout", function (event) {
      this.style.cursor = "auto"
    })
  }

  componentDidMount() {}

  render() {
    return(
        <table style={{fontSize:'12px',border:'0px',borderSpacing:'0px'}}>
          <tr id={'row-' + importedData[0].short_id} style={{height:'8px'}}><td rowspan={importedData.length+2}><GitGraph
            initializeGraph={this.initializeGraph}
            ref={(gitgraph)=>{this.gitgraph=gitgraph}}
            options={{
                  template: this.myTemplateConfig,
                  reverseArrow: false,
                  orientation: "vertical",
                  mode: "extended"}} /></td>{this.getCommitMessage(this.myTemplateConfig, importedData[0])}</tr>
            {this.createRows(this.myTemplateConfig)}
        </table>
    )
  }

  createRows = (myTemplateConfig) => {
    let table = []
    for (let i = 1; i < importedData.length; i++) {
      table.push(<tr id={'row-' + importedData[i].short_id} style={{height:'8px'}}>{this.getCommitMessage(this.myTemplateConfig, importedData[i])}</tr>)
    }
    table.push(<tr style={{height:'8px'}}>{this.getCommitMessage(myTemplateConfig, null)}</tr>)
    table.push(<tr style={{height:'8px'}}>{this.getCommitMessage(myTemplateConfig, null)}</tr>)
    return table
  }

  getCommitMessage = (myTemplateConfig, commit) => {
    return [
      <td align="left" style={{paddingTop:'0px',paddingBottom:'0px',paddingLeft:'10px',paddingRight:'3px'}}>{commit ? commit.tag ? <FaTag /> : undefined : undefined}</td>,
      <td align="left" style={{paddingTop:'0px',paddingBottom:'0px',paddingLeft:'3px',paddingRight:'10px'}}>{commit ? commit.tag ? commit.tag : undefined : undefined}</td>,
      <td align="left" style={{paddingTop:'0px',paddingBottom:'0px',paddingLeft:'10px',paddingRight:'3px'}}>{commit ? <FaCodeFork /> : undefined}</td>,
      <td align="left" style={{paddingTop:'0px',paddingBottom:'0px',paddingLeft:'3px',paddingRight:'10px'}}>{commit ? '[' + commit.branch + ']' : undefined}</td>,
      <td align="left" style={{paddingTop:'0px',paddingBottom:'0px',paddingLeft:'10px',paddingRight:'10px'}}>{commit ? commit.short_id : undefined}</td>,
      <td align="left" style={{paddingTop:'0px',paddingBottom:'0px',paddingLeft:'10px',paddingRight:'10px'}}>{commit ? commit.title : undefined}</td>,
      <td align="left" style={{paddingTop:'0px',paddingBottom:'0px',paddingLeft:'10px',paddingRight:'3px'}}>{commit ? <FaUser /> : undefined}</td>,
      <td align="left" style={{paddingTop:'0px',paddingBottom:'0px',paddingLeft:'3px',paddingRight:'10px'}}>{commit ? commit.author_name + "<" + commit.author_email + ">" : undefined}</td>,
      <td align="left" style={{paddingTop:'0px',paddingBottom:'0px',paddingLeft:'10px',paddingRight:'10px'}}>{commit ? commit.created_at : undefined}</td>
    ]
  }

  import(gitgraph) {
    var commits = importedData
      
    for (var i = 0; i<commits.length;i++){
        var commit = commits[i];
        this.nodesStore.push({
            'tag': commit["tag"],
            'branch': commit["branch"],
            'id': commit["short_id"],
            'full_id': commit["full_id"],
            'date': commit["created_at"],
            'message': commit["message"],
            'author': commit["author_name"]+ "<"+commit["author_email"]+">",
            'parentIds': commit["parent_ids"],
            'placed':false,
            'childrenPlaced':[]
        });
    }

    var firstNode = _.find(this.nodesStore, { 'parentIds': [] });

    this.branches[0] = gitgraph.branch(firstNode.branch);
    this.branchesBucket[0]= [];
    this.branchesBucket[0].push(firstNode.full_id);
    
    // for each node in the node set to place
    this.nodesStore.forEach((node,index) => {
        // we find the branch the node is belongig to 
        var actualBranchIndex = this.findBranchFromCommit(this.branchesBucket, node.full_id);

        // check if this is a merge
        if (node.parentIds.length <2){
            // commit the node
            if (index === 0){
              this.branches[actualBranchIndex].commit(this.commitAttributes(node));
            } else {
                if (this.branches[actualBranchIndex].name !== node.branch) {

                  let b = -1
                  this.branches.forEach((branch, index) => {
                    if (branch.name === node.branch) {
                      b = index;
                    }
                  })
                  if (-1 === b) {
                    // prepare branch info
                    let branchCnt = this.branches.length;
                    this.branchesBucket[branchCnt] = [];
                    this.branchesBucket[branchCnt].push(node.full_id);
                    // create branch
                    this.branches[branchCnt] = this.branches[actualBranchIndex].branch(node.branch);
                    actualBranchIndex = branchCnt
                  } else {
                    actualBranchIndex = b
                  }
                }
                this.branches[actualBranchIndex].commit(this.commitAttributes(node));
            }
        } else {
            // find the other branch to merge to
            var otherBranch = this.findTheOtherBranchIndex(node.full_id,actualBranchIndex,this.branchesBucket);
            
            console.log(node.full_id);
            // merge
            console.log("merge : "+actualBranchIndex);
            console.log("in : "+otherBranch);
            this.branches[actualBranchIndex].merge(this.branches[otherBranch], this.commitAttributes(node));
            actualBranchIndex = otherBranch
            
            // make sure the resulting commit is in the actualBranch (resulting banch of the merge)
            var pos = this.branchesBucket[otherBranch].indexOf(node.full_id);
            if (pos>-1){
              this.branchesBucket[otherBranch].splice(pos,1);
            }
        }
        
        // check children count
        node.children = this.findChildren(node.full_id,this.nodesStore);
        
        // if more than one child = we need to branch for child after the first one
        if (node.children.length>1){
            // we branch for each child following the first one
            for (var i=1;i<node.children.length;i++ ) {
              var branch = _.find(this.branches, { 'name': node.children[i].branch });
              if (undefined === branch){
                // prepare branch info
                let branchCnt = this.branches.length;
                this.branchesBucket[branchCnt] = [];
                this.branchesBucket[branchCnt].push(node.children[i].full_id);

                // create branch
                this.branches[branchCnt] = this.branches[actualBranchIndex].branch(node.children[i].branch);
              } else {
                let branchCnt = this.branches.map((e) => { return e.name; }).indexOf(branch.name);
                this.branchesBucket[branchCnt].push(node.children[i].full_id);
              }
            }
        }
        if (node.children.length > 0) {
            // we add the child to the actual branch
            this.branchesBucket[actualBranchIndex].push(node.children[0].full_id);
        }
    })
  }

  findChildren(commitId,nodesStore) {
      var children = [];
       nodesStore.forEach((node) => {
           if (node.parentIds.indexOf(commitId)>-1){
               children.push(node);
           }
       });
      return children;
  }   
  
  findBranchFromCommit(branchesBucket, commitId) {
      var branchIndex = 0;
      if (branchesBucket.length === 1) return 0;
      branchesBucket.forEach((branchBucket, index) => {
          if (branchBucket.indexOf(commitId) > -1) {
              branchIndex = index;
          }
      })
      return branchIndex;
  }   

  findTheOtherBranchIndex(commitId,actualBranch,branchesBucket){
      var otherBranchIndex = 0;
      branchesBucket.forEach((brancheBucket,index) => {
          if ((brancheBucket.indexOf(commitId)>-1)&&(index!==actualBranch)){
              otherBranchIndex = index;
          }
      })
      return otherBranchIndex;
  }
}

export default GitGraphWidget;

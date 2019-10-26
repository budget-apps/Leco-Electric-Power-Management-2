import React from 'react';

const SelectionDetails = ({ selectedNodes }) => {
    if(selectedNodes.length >0){
        alert("selected")
    }
    const message = selectedNodes.reduce((result, current) => result + ' ' + current, '');
    return <div>{selectedNodes.length === 0 ? 'No selection' : 'Selection: ' + message}</div>;
};

export default SelectionDetails;

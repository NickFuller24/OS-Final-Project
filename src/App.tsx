import React, { useEffect, useRef, useState } from "react";
import { FIFO, SJF, SRT, RR, Process, gridData } from "./utils/Algorithms";
import styled, { AnyStyledComponent } from "styled-components";
import Visualizer from "./components/common/Visualizer";
import { Button, Modal, InputNumber, Slider, Timeline } from "antd";

import "./App.css";
// import gridData from "./utils/initialGridData.json";

const OSApp: AnyStyledComponent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ff9b71;
  font-family: "KoHo", sans-serif;
  color: white;
`;
const VisualizerGroup: AnyStyledComponent = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
`;

const AlgoButton: AnyStyledComponent = styled.button`
  margin: 5px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: #ff9b71;
  border: none;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    text-decoration: underline solid white;
  }
`;
const ArrivalProcess: AnyStyledComponent = styled.div`
  display: flex;
  flex-direction: row;
  > h4 {
    flex: 1;
  }
`;
const CPUTimeProcess: AnyStyledComponent = styled.div`
  display: flex;
  flex-direction: row;
  > h4 {
    flex: 1;
  }
`;
const NewProcessInputs: AnyStyledComponent = styled.div`
  display: flex;
  flex-direction: column;
`;
const InputGroup: AnyStyledComponent = styled.div`
  width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;
const AlgorithmButtons: AnyStyledComponent = styled.div`
  display: inline-block;
  padding: 20px;
`;
const SliderGroup: AnyStyledComponent = styled.div`
  display: inline-block;
  width: 200px;
  text-align: center;
`;

function App() {
  const [algoData, setAlgoData]: any[] = useState([]);
  const [currentProcesses, setCurrentProcesses]: any[] = useState([]);
  const [counter, setCounter] = useState(0);
  const [arrivalTime, setArrivalTime] = useState(1);
  const [cpuTime, setCPUTime] = useState(1);
  const [timeQuantum, setTimeQuantum] = useState(1);
  const [delay, setDelay] = useState(3);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const timer: any = useRef(null);

  let newProcess: Process;

  const handleOk = () => {
    newProcess = new Process(
      "p" + (currentProcesses.length + 1),
      arrivalTime,
      cpuTime
    );
    setCurrentProcesses((oldProcesses: any) => [...oldProcesses, newProcess]);
    // setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const arrivialInputChange = (value: number) => {
    setArrivalTime(value);
  };
  const cpuInputChange = (value: number) => {
    setCPUTime(value);
  };
  const timeQuantumChange = (value: number) => {
    setTimeQuantum(value);
  };
  const delayChange = (value: number) => {
    setDelay(value);
  };

  useEffect(() => {
    // useRef value stored in .current property
    timer.current = setInterval(() => setCounter((v) => v + 1), 1000 / delay);
    // clear on component unmount

    return () => {
      clearInterval(timer.current);
      setCounter(0);
    };
  }, [algoData, currentProcesses, delay]);

  const processButtonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsModalVisible(true);
  };
  const setDataHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    for (let i = 0; i < 3; i++) {
      setCurrentProcesses((oldProcesses: any) => [
        ...oldProcesses,
        gridData[i],
      ]);
    }
  };
  const algoButtonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;

    switch (button.textContent) {
      case "FIFO": {
        setAlgoData(FIFO(currentProcesses));
        setCounter(0);

        break;
      }
      case "SJF": {
        setAlgoData(SJF(currentProcesses));
        setCounter(0);
        break;
      }
      case "SRT": {
        setAlgoData(SRT(currentProcesses));
        setCounter(0);
        break;
      }
      case "RR": {
        // have to give it a time quantum
        setAlgoData(RR(timeQuantum, currentProcesses));
        setCounter(0);
        break;
      }
    }
  };

  return (
    <OSApp>
      <InputGroup>
        <AlgorithmButtons>
          <Button
            style={{
              margin: "5px",
              color: "#ff9b71",
              backgroundColor: "white",
              fontWeight: "bold",
              border: "none",
            }}
            type="primary"
            shape="round"
            size="large"
            onClick={processButtonHandler}
          >
            New Process
          </Button>
          <AlgoButton onClick={algoButtonHandler}>FIFO</AlgoButton>
          <AlgoButton onClick={algoButtonHandler}>SJF</AlgoButton>
          <AlgoButton onClick={algoButtonHandler}>SRT</AlgoButton>
          <AlgoButton onClick={algoButtonHandler}>RR</AlgoButton>
          <Button
            style={{ margin: "10px" }}
            type="dashed"
            ghost={true}
            shape="round"
            size="small"
            onClick={setDataHandler}
          >
            Set Data
          </Button>
        </AlgorithmButtons>
        <SliderGroup>
          <div style={{ display: "block" }}>
            <div style={{ fontSize: "20px" }}>Time Quantum</div>
            <Slider
              style={{ margin: "5px" }}
              onChange={timeQuantumChange}
              defaultValue={1}
              min={1}
              max={10}
              disabled={false}
            />
          </div>
          <div style={{ display: "block" }}>
            <div style={{ fontSize: "20px" }}>Visualization Speed</div>
            <Slider
              style={{ margin: "5px" }}
              onChange={delayChange}
              defaultValue={3}
              min={1}
              max={5}
              disabled={false}
            />
          </div>
        </SliderGroup>
      </InputGroup>

      <VisualizerGroup>
        {algoData.length !== 0 ? (
          <Visualizer
            counter={counter}
            currentTimer={timer.current}
            algorithmGridData={algoData}
            basicGridData={currentProcesses}
          />
        ) : (
          <div>Click an algorithm to start!</div>
        )}
      </VisualizerGroup>

      <Modal
        title="Create a new process"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="300px"
        okText="Add process"
        cancelText="Done"
      >
        <NewProcessInputs>
          <ArrivalProcess>
            {" "}
            <h4>Arrival Time</h4>
            <InputNumber
              min={1}
              max={10}
              defaultValue={1}
              onChange={arrivialInputChange}
            />
          </ArrivalProcess>
          <CPUTimeProcess>
            {" "}
            <h4>Total CPU Time</h4>
            <InputNumber
              min={1}
              max={10}
              defaultValue={1}
              onChange={cpuInputChange}
            />
          </CPUTimeProcess>
        </NewProcessInputs>

        <Timeline>
          {[...Array(currentProcesses.length)].map((e, key) => (
            <Timeline.Item key={key}>
              <p>{currentProcesses[key].name}</p>
              <p>Arrival Time: {currentProcesses[key].arrivalTime}</p>
              <p>CPU Time: {currentProcesses[key].totalCPUTime}</p>
            </Timeline.Item>
          ))}
        </Timeline>
      </Modal>
    </OSApp>
  );
}

export default App;

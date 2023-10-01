import React, { useCallback, useEffect, useState } from "react";
import "./App.scss";
import { getEventListeners } from "stream";

function App() {
  //Regex
  let regex: RegExp = /[0-9]|[x+-/]/;
  //키를 클릭했을 시 어떤 키가 눌렸는지 사용자에게 보여줄 변수
  const [num, setNum] = useState("0");
  //입력한 공식을 저장할 변수
  const [formular, setFormular] = useState("0");
  //계산 함수 useCallback함수를 사용하여 num,formular 값이 변경 되었을 때만 함수가 업데이트 되도록 하였다.
  const calculateFormular = useCallback(() => {
    let arithmeticRegex = /([0-9]+(\+|\-|x|\/)+)+[0-9]+/g;
    if (!(formular.match(arithmeticRegex) != null)) {
      alert("계산식을 완성후 눌러주세요!");
      return;
    }
    if (formular.includes("=")) {
      alert("이미 계산이 완료되었습니다. AC를 눌러 초기화 해주세요");
      return;
    }
    let tempForm: string = formular.replaceAll("x", "*");
    //Eval대신 사용하는 new Function
    let result: string = new Function("return " + tempForm)();
    let resultNum: number = 0;
    if (Number.isNaN(Number.parseInt(result))) {
      setNum("숫자 아님");
      setFormular("숫자 아님");
    } else {
      //소수점 이하 버림
      resultNum = Math.floor(Number.parseFloat(result));
      setNum(
        resultNum.toString().length > 10 ? "Infinity" : resultNum.toString()
      );
      setFormular(
        formular +
          "=" +
          (resultNum.toString().length > 10 ? "Infinity" : resultNum.toString())
      );
    }
  }, [num, formular]);
  //num의 값을 업데이트 해주는 함수로 num, formular가 업데이트 되었을 때만 새로운 함수를 반환하도록 하였다.
  const setnewValue = useCallback(
    (value: string) => {
      //계산이 이미 끝난 것을 의미하니 아무 일도 없게 한다.
      if (formular.includes("=")) {
        return;
      }

      if (num.length >= 10 && value.match(/[0-9]/) != null) {
        return;
      }
      if (!Number.isNaN(Number.parseInt(value))) {
        setNum(Number.parseInt(num.replace(/[^0-9]/g, "") + value).toString());
      } else {
        setNum(value);
      }
      //처음값이 0일때 처리
      if (formular === "0") {
        setFormular(() => value);
      } else {
        //
        if (
          !(formular.charAt(formular.length - 1).match(/[0-9]/) != null) &&
          !(value.match(/[0-9]/) != null)
        ) {
          setFormular(formular.slice(0, formular.length - 1) + value);
        } else {
          setFormular(formular + value);
        }
      }
    },
    [num, formular]
  );
  //key를 통한 입력
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (regex.test(e.key)) {
        setnewValue(e.key.toString());
        return;
      }
      if (e.key.match("=") != null) {
        calculateFormular();
      }
    },
    [formular]
  );
  //formular의 값이 업데이트 될때마다 바뀐 handleKeydown이 입력되도록 했다.
  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    //formular가 바뀌어서 기존 값이 unmount될때 기존에 등록된 event handler를 삭제하도록 하였다.
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [formular]);
  return (
    <div className="App">
      <header>
        <span className="change" style={{ fontSize: "50px" }}>
          추석 세뱃돈 계산기
        </span>
      </header>
      <div className="calculator">
        <div className="screen">
          <p className="display">{num}</p>
          <p className="subdisplay">{formular}</p>
        </div>
        <div className="keys">
          <div
            className="key"
            onClick={() => {
              setNum("0");
              setFormular("0");
            }}>
            AC
          </div>
          <div
            className="key"
            onClick={() => {
              if (formular.includes("=")) {
                return;
              }
              if (formular === "0") {
                return;
              }
              setFormular(
                formular.slice(
                  0,
                  formular.lastIndexOf(num) > -1
                    ? formular.lastIndexOf(num)
                    : formular.length
                )
              );
              setNum("0");
            }}>
            C
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("/");
            }}>
            /
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("x");
            }}>
            x
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("7");
            }}>
            7
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("8");
            }}>
            8
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("9");
            }}>
            9
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("-");
            }}>
            -
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("4");
            }}>
            4
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("5");
            }}>
            5
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("6");
            }}>
            6
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("+");
            }}>
            +
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("1");
            }}>
            1
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("2");
            }}>
            2
          </div>
          <div
            className="key"
            onClick={() => {
              setnewValue("3");
            }}>
            3
          </div>
          <div className="key intro" onClick={calculateFormular}>
            =
          </div>
          <div
            className="key zero"
            onClick={() => {
              setnewValue("0");
            }}>
            0
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

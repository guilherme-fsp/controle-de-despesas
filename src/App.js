import React, { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function App() {
  // Estado das despesas
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [despesas, setDespesas] = useState([]);

  // Estado da calculadora
  const [calcExpression, setCalcExpression] = useState("");

  // Ref do gráfico
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Registrar despesa
  const adicionarDespesa = (e) => {
    e.preventDefault();
    if (!descricao || !valor) return;

    setDespesas([...despesas, { descricao, valor: parseFloat(valor) }]);
    setDescricao("");
    setValor("");
  };

  // Atualizar gráfico sempre que despesas mudarem
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: despesas.map((d) => d.descricao),
        datasets: [
          {
            label: "Despesas (R$)",
            data: despesas.map((d) => d.valor),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });
  }, [despesas]);

  // Funções da calculadora
  const addToCalc = (value) => setCalcExpression(calcExpression + value);

  const clearCalc = () => setCalcExpression("");

  const calculate = () => {
    try {
      setCalcExpression(eval(calcExpression).toString());
    } catch {
      setCalcExpression("Erro");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Controle de Despesas 💰
      </h1>

      {/* Formulário de despesas */}
      <form onSubmit={adicionarDespesa} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Adicionar
        </button>
      </form>

      {/* Lista de despesas */}
      <h2>Lista de Despesas</h2>
      <ul>
        {despesas.map((d, i) => (
          <li key={i}>
            {d.descricao} - R$ {d.valor.toFixed(2)}
          </li>
        ))}
      </ul>

      {/* Gráfico */}
      <h2 style={{ marginTop: "2rem" }}>Resumo Mensal</h2>
      <canvas ref={chartRef} style={{ maxWidth: "600px" }} />

      {/* Calculadora */}
      <h2 style={{ marginTop: "2rem" }}>Calculadora</h2>
      <div
        style={{
          maxWidth: "200px",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#f0f0f0",
            padding: "1rem",
            marginBottom: "0.5rem",
            borderRadius: "5px",
            fontSize: "1.2rem",
            textAlign: "right",
          }}
        >
          {calcExpression || "0"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px" }}>
          {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === "=" ? calculate() : addToCalc(btn))}
              style={{ padding: "1rem", fontSize: "1rem" }}
            >
              {btn}
            </button>
          ))}
        </div>
        <button
          onClick={clearCalc}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem",
            width: "100%",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          C
        </button>
      </div>
    </div>
  );
}

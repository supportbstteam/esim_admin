"use client";

import React from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useRouter } from "next/navigation";

// Import Bebas Neue font globally
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
`;

const borderAnimation = keyframes`
  to {
    --angle: 360deg;
  }
`;

const StatCard = styled.div`
  --angle: 0deg;
  border: 4px solid transparent;
  border-radius: 15px;
  width: 320px;
  height: 220px;
  background:
    linear-gradient(135deg, #f7fafc 100%, #f7fafc 100%) padding-box,
    conic-gradient(from var(--angle), #16325d 20%, #37c74f, #16325d 80%) border-box;
  color: #16325d;
  box-shadow: 0 4px 28px rgba(16, 32, 60, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${borderAnimation} 6s linear infinite;
  background-clip: padding-box, border-box;
  background-origin: border-box;
  transition: transform 0.18s cubic-bezier(.4,.2,.3,1);
  cursor: pointer;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 8px 42px rgba(54, 199, 79, 0.15);
  }
`;

const IconBox = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 54px;
    height: 54px;
    color: #37c74f;
    filter: drop-shadow(0 0 6px #37c74f55);
  }
`;

const CardTitle = styled.div`
  font-family: "Bebas Neue", cursive, sans-serif;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.18rem;
  opacity: 0.95;
  text-align: center;
  color: #16325d;
`;

const CardValue = styled.div`
  font-family: "Bebas Neue", cursive, sans-serif;
  font-size: 2.9rem;
  font-weight: bold;
  text-align: center;
  color: #16325d;
`;

type Props = {
  title: string;
  value: number;
  icon: React.ReactNode;
  route?: string; // route is optional
};

const CardStat = ({ title, value, icon, route }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <>
      <GlobalStyle />
      <StatCard onClick={handleClick}>
        <div className="flex items-center gap-2">
          <IconBox>{icon}</IconBox>
          <CardTitle>{title}</CardTitle>
        </div>

        <CardValue>{value}</CardValue>
      </StatCard>
    </>
  );
};

export default CardStat;
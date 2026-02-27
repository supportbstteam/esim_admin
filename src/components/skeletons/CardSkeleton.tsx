"use client";

import React from "react";
import styled from "styled-components";

const SkeletonCard = styled.div`
  width: 320px;
  height: 220px;
  border-radius: 15px;
  background: #f7fafc;
  box-shadow: 0 4px 28px rgba(16, 32, 60, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const IconSkeleton = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background: #e2e8f0;
`;

const TitleSkeleton = styled.div`
  width: 120px;
  height: 28px;
  border-radius: 6px;
  background: #e2e8f0;
`;

const ValueSkeleton = styled.div`
  width: 100px;
  height: 40px;
  border-radius: 6px;
  background: #e2e8f0;
`;

const CardStatSkeleton = () => {
  return (
    <SkeletonCard>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <IconSkeleton />
        <TitleSkeleton />
      </div>

      <ValueSkeleton />
    </SkeletonCard>
  );
};

export default CardStatSkeleton;
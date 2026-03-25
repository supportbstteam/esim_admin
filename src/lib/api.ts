"use client";

import axios, { AxiosRequestConfig, AxiosError, Method } from "axios";
import Cookies from "js-cookie";

interface ApiOptions<T = unknown, P = unknown> extends AxiosRequestConfig {
  method?: Method;
  url: string;
  data?: T;
  params?: P;
  isAuth?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function api<T = unknown, P = unknown>({
  url,
  method = "GET",
  data,
  params,
  isAuth = true,
  ...rest
}: ApiOptions<T, P>): Promise<T> {
  try {
    // ✅ merge headers from request
    const headers: Record<string, any> = {
      ...(rest.headers || {}),
    };

    // ✅ attach auth token
    if (isAuth) {
      const token = Cookies.get("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    // ✅ IMPORTANT: handle FormData automatically
    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const res = await axiosInstance({
      url,
      method,
      data,
      params,
      headers,
      ...rest,
    });

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw error;
  }
}
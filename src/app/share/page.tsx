"use client";
import { useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import GoogleMapComponent from "@/components/MapComponent"; // Google Mapsコンポーネント
import { font } from "@/font/font";
import Link from "next/link";
import useCurrentLocation from "@/hooks/useCurrentLocation"; // 現在地取得フックをインポート
import UnLoadedPage from "@/components/UnLoadedPage";

type typeofMarker = {
  lat: number;
  lng: number;
  emoji: string;
};

export default function Map() {
  // Google Maps APIを読み込む
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // 環境変数からAPIキーを取得
  });

  const [markers, setMarkers] = useState<typeofMarker[]>([]); // マーカー情報を保存する状態
  const { location, locationError } = useCurrentLocation(); // 現在地を取得するカスタムフックを使用

  // 初回レンダリング時にローカルストレージからマーカー情報を読み込む
  useEffect(() => {
    const savedMarkers = localStorage.getItem("markers"); // ローカルストレージに保存されたマーカー情報を取得
    if (savedMarkers) {
      setMarkers(JSON.parse(savedMarkers)); // マーカー情報があれば状態にセット
    }
  }, []);

  // マーカー情報をローカルストレージに保存する関数
  const saveMarkersToLocalStorage = (updatedMarkers: typeofMarker[]) => {
    localStorage.setItem("markers", JSON.stringify(updatedMarkers)); // マーカー情報をJSON形式で保存
  };

  // 地図をクリックした際に新しいマーカーを追加する関数
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng && isLoaded) {
      const emoji = prompt("絵文字を選んでください: 😊, 😢, 😡, 😍, 😎", "😊"); // ユーザーに絵文字を入力させる
      console.log(event);
      const newMarker = {
        lat: event.latLng.lat(), // クリックした場所の緯度
        lng: event.latLng.lng(), // クリックした場所の経度
        emoji: emoji || "😊", // デフォルトで絵文字を設定
      };
      if (emoji !== null) {
        const updatedMarkers = [...markers, newMarker]; // 既存のマーカーに新しいマーカーを追加
        setMarkers(updatedMarkers); // マーカー状態を更新
        saveMarkersToLocalStorage(updatedMarkers); // ローカルストレージに新しいマーカーを保存
      } else {
        window.alert("投稿がキャンセルされました");
        return;
      }
    } else {
      window.alert("位置情報が正しく取得できませんでした");
    }
  };

  //マーカーをクリックした際に削除する関数
  const handleMarkerClick = (index: number) => {
    const confirmDelete = window.confirm("このマーカーを削除しますか？"); //確認メッセージ
    if (confirmDelete) {
      const updatedMarkers = markers.filter((_, i) => i !== index); // クリックされたマーカーを除外して新しい配列を作成
      setMarkers(updatedMarkers); // マーカー状態を更新
      saveMarkersToLocalStorage(updatedMarkers); // ローカルストレージに更新されたマーカー情報を保存
    }
  };

  if (!isLoaded) return <UnLoadedPage />; // Google Maps APIが読み込まれるまでローディング表示
  // 位置情報の取得に失敗した場合はエラーメッセージを表示
  if (locationError) window.alert("Failed to load location");
  // Google Mapsの読み込みに失敗した場合はエラーメッセージを表示
  if (loadError) window.alert("Failed to load Google Maps");

  return (
    <div>
      {/* ヘッダーの表示 */}
      <div className="w-full h-[90px] bg-[#ee9ecc] text-slate-100">
        <span className={`${font.className} flex flex-row justify-between`}>
          <Link href="/" className="text-5xl pt-5 pl-7">
            Emocean
          </Link>
          <span className="flex justify-between mt-8 mr-8">
            <Link href="/map" className="text-3xl">
              map
            </Link>
            <Link href="/hackathon" className="ml-7 text-3xl">
              hackathon
            </Link>
          </span>
        </span>
      </div>

      {/* 地図の表示 */}
      <div className="w-full h-[calc(100vh-90px)]">
        <GoogleMapComponent
          center={location || { lat: 35.6762, lng: 139.6503 }} // 現在地を地図の中心に設定。取得できなければ東京をデフォルト
          markers={markers} // マーカー情報を渡す
          onMapClick={handleMapClick} // 地図クリック時に新しいマーカーを追加
          onMarkerClick={handleMarkerClick} // マーカークリック時に削除を実行
        />
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStreamsWithStreamers, formatViewers, getStreamDuration } from "../../data/streamers";
import "./CarruselStreams.css";

const streamsData = getStreamsWithStreamers();

const CarruselStreams: React.FC = () => {
	const navigate = useNavigate();
	const [currentIndex, setCurrentIndex] = useState(0);
	const itemsPerPage = 4; // Número de streams visibles a la vez
	const totalPages = Math.ceil(streamsData.length / itemsPerPage);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => 
			prevIndex === totalPages - 1 ? 0 : prevIndex + 1
		);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => 
			prevIndex === 0 ? totalPages - 1 : prevIndex - 1
		);
	};

	const getCurrentStreams = () => {
		const startIndex = currentIndex * itemsPerPage;
		return streamsData.slice(startIndex, startIndex + itemsPerPage);
	};

	return (
		<div className="carrusel-streams">
			<div className="carrusel-streams__header">
				<h2 className="carrusel-streams__titulo">Canales en la cima</h2>
				<div className="carrusel-streams__controles">
					<button 
						className="carrusel-streams__btn carrusel-streams__btn--prev"
						onClick={prevSlide}
						disabled={currentIndex === 0}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>
					<button 
						className="carrusel-streams__btn carrusel-streams__btn--next"
						onClick={nextSlide}
						disabled={currentIndex === totalPages - 1}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>
				</div>
			</div>

			<div className="carrusel-streams__container">
				<div className="carrusel-streams__grid">
					{getCurrentStreams().map((stream) => (
						<div 
							key={stream.id} 
							className="carrusel-streams__card carrusel-streams__card--clickable"
							onClick={() => navigate(`/stream/${stream.streamerId}`)}
						>
							<div className="carrusel-streams__miniatura">
								{stream.thumbnail ? (
									<img 
										src={stream.thumbnail} 
										alt={stream.title}
										className="carrusel-streams__img"
									/>
								) : (
									<div className="carrusel-streams__img">
										{stream.game}
									</div>
								)}
								{stream.streamer.isLive && (
									<span className="carrusel-streams__live-badge">EN VIVO</span>
								)}
								<span className="carrusel-streams__espectadores">
									{formatViewers(stream.viewers)} espectadores
								</span>
								<span className="carrusel-streams__duracion">
									{getStreamDuration(stream.startedAt)}
								</span>
							</div>
							<div className="carrusel-streams__info">
								<div className="carrusel-streams__avatar">
									{stream.streamer.avatar ? (
										<img 
											src={stream.streamer.avatar} 
											alt={stream.streamer.displayName}
											className="carrusel-streams__avatar-img"
										/>
									) : (
										<div className="carrusel-streams__avatar-img">
											{stream.streamer.displayName.charAt(0).toUpperCase()}
										</div>
									)}
									{stream.streamer.verified && (
										<div className="carrusel-streams__verified" title="Verificado">
											<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												{/* Estrella de verificado */}
												<path 
													d="M10 1.5L12.7 6.8L18.5 7.6L14.2 11.7L15.4 17.4L10 14.8L4.6 17.4L5.8 11.7L1.5 7.6L7.3 6.8L10 1.5Z" 
													fill="#1DA1F2" 
													stroke="#ffffff" 
													strokeWidth="0.3"
												/>
												{/* Checkmark blanco */}
												<path 
													d="M7 10L9 12L13 8" 
													stroke="white" 
													strokeWidth="1.5" 
													strokeLinecap="round" 
													strokeLinejoin="round"
												/>
											</svg>
										</div>
									)}
								</div>
								<div className="carrusel-streams__detalles">
									<h3 className="carrusel-streams__stream-titulo">
										{stream.title}
									</h3>
									<p className="carrusel-streams__streamer">
										{stream.streamer.displayName}
									</p>
									<p className="carrusel-streams__categoria">
										{stream.category}
									</p>
									<div className="carrusel-streams__tags">
										{stream.tags.slice(0, 2).map((tag, index) => (
											<span key={index} className="carrusel-streams__tag">
												{tag}
											</span>
										))}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Indicadores de página */}
			<div className="carrusel-streams__indicadores">
				{Array.from({ length: totalPages }).map((_, index) => (
					<button
						key={index}
						className={`carrusel-streams__indicador ${
							index === currentIndex ? 'carrusel-streams__indicador--active' : ''
						}`}
						onClick={() => setCurrentIndex(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default CarruselStreams;
SELECT 
    a.Id,
	a.Type,
	u.UserName as Author,
	a.TradeCashInPerson, 
    a.TradeCashByMail, 
    a.TradeMoneyOrderByMail, 
    a.TradeOther,
	a.AmountFrom,
	a.AmountTo,
	a.FixedPrice,
	a.PercentageAdjustment,
	a.Currency,
	a.AdditionalInfo,
	a.TravelDistance,
	a.TravelDistanceUoM,
	a.CountryCode,
	a.StateCode,
	a.City,
	a.PostalCode,
	a.Status,
	a.CreatedAt 
FROM getskytrade.Adverts a 
LEFT JOIN getskytrade.Users u ON a.Author = u.Id 
ORDER BY CreatedAt LIMIT 10

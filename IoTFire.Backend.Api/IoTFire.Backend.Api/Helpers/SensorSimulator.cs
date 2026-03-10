using IoTFire.Backend.Api.Models.Entities.Enums;

namespace IoTFire.Backend.Api.Helpers
{
    public static class SensorSimulator
    {
        private static readonly Random _random = new();

        public static float GenerateValue(SensorType type)
        {
            return type switch
            {
                SensorType.TEMPERATURE =>
                    (float)Math.Round(_random.NextDouble() * 60 + 15, 2), // 15-75°C
                SensorType.GAS =>
                    (float)Math.Round(_random.NextDouble() * 600, 2),     // 0-600 ppm
                SensorType.FLAME =>
                    _random.Next(0, 2),                                   // 0 ou 1
                _ => 0
            };
        }

        public static string GetUnit(SensorType type)
        {
            return type switch
            {
                SensorType.TEMPERATURE => "°C",
                SensorType.GAS        => "ppm",
                SensorType.FLAME      => "détecté",
                _                     => ""
            };
        }

        public static string GetSeverity(
            float value, float threshold, SensorType type)
        {
            if (type == SensorType.FLAME)
                return value == 1 ? "CRITICAL" : "NORMAL";

            if (value >= threshold)          return "CRITICAL";
            if (value >= threshold * 0.75f)  return "WARNING";
            return "NORMAL";
        }
    }
}

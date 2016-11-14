angular.module('roomSearchFilter', []).filter('roomFilter', [function () {
    return function (rooms, query) {
        if (!angular.isUndefined(rooms) && !angular.isUndefined(query)) {
            var filteredRooms = [];

            angular.forEach(rooms, function (room) {
                var pushRoom;
                //Are there any inputs
                var hasNrOfPeople = query.nrOfPeople !== '';
                var hasCompany = query.company !== null;
                var hasCity = query.city !== null;
                //The conditions
                var nrOfPeopleCondition = room.nrOfPeople >= query.nrOfPeople;
                var companyCondition = room.company === query.company;
                var cityCondition = room.city === query.city;

                //The logix
                if (hasNrOfPeople && hasCompany && hasCity) {
                    pushRoom = nrOfPeopleCondition && companyCondition && cityCondition;
                } else if (hasNrOfPeople && hasCompany && !hasCity) {
                    pushRoom = nrOfPeopleCondition && companyCondition;
                } else if (hasNrOfPeople && !hasCompany && !hasCity) {
                    pushRoom = nrOfPeopleCondition;
                } else if (!hasNrOfPeople && hasCompany && hasCity) {
                    pushRoom = companyCondition && cityCondition;
                } else if (!hasNrOfPeople && !hasCompany && hasCity) {
                    pushRoom = cityCondition;
                } else if (!hasNrOfPeople && hasCompany && !hasCity) {
                    pushRoom = companyCondition;
                } else {
                    pushRoom = true;
                }
                if (pushRoom) {
                    filteredRooms.push(room);
                }
            });
            query.nrOfHits = filteredRooms.length;
            return filteredRooms;
        } else {
            query.nrOfHits = rooms.length;
            return rooms;
        }
    };
}]);
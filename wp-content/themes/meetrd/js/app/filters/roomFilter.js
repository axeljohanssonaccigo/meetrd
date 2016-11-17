angular.module('roomSearchFilter', []).filter('roomFilter', [function () {
    return function (rooms, query) {

        if (!angular.isUndefined(rooms) && !angular.isUndefined(query)) {
            //            query.hasFiltered = false;
            var filteredRooms = [];

            angular.forEach(rooms, function (room) {
                var pushRoom;
                //Are there any inputs
                var hasNrOfPeople = query.nrOfPeople !== '';
                var hasCompany = query.companyName !== null;
                var hasCity = query.city !== null;
                //The conditions
                var nrOfPeopleCondition = room.nrOfPeople >= query.nrOfPeople;
                var companyCondition = room.company === query.companyName;
                var cityCondition = room.city === query.city;



                //The logix
                if (!hasNrOfPeople && !hasCompany && !hasCity) {
                    query.isSearchResult = false;
                } else {
                    query.isSearchResult = true;
                }
                if (hasNrOfPeople && hasCompany && hasCity) {
                    pushRoom = nrOfPeopleCondition && companyCondition && cityCondition;
                } else if (hasNrOfPeople && hasCompany && !hasCity) {
                    pushRoom = nrOfPeopleCondition && companyCondition;
                } else if (hasNrOfPeople && !hasCompany && hasCity) {
                    pushRoom = nrOfPeopleCondition && cityCondition;
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
            if (query.nrOfHits < query.shownRoomsDefault) {
                query.shownRooms = query.nrOfHits;
            }
            return filteredRooms;
        } else {
            query.nrOfHits = rooms.length;
            //            query.hasFiltered = true;
            return rooms;
        }
    };
}]);